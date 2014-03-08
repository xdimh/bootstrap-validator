!function(window,$,undefined){
	


	$.fn.validator = function(config,rules){
		var _config = config || [],
			rules = $.extend({},$.fn.validator.rules,rules || {});

		return this.each(function(){
			

			function _initRulesCallback() {
				var i,len,vObject,_callback;
				for(i = 0,len=config.length; i < len; i++) {
					vObject = _config[i];
					if( vObject.ruleNames && vObject.ruleNames.trim() !== "" ) {
						_rules = vObject.ruleNames.split(" ");
						_callback = [];
						for(j = 0; j < _rules.length; j++) {
							if(_rules[j] in rules) {
								if(!_executeValidate(vObject,rules[_rules[j]])) {
									_createErrorTip(vObject);
									break;
								}	
							} else {
								throw new Error("no handler map to " + _rules[j]);
							}
						}
					}
				}
			}

			function _executeValidate(vObject,rule) {
				var callback = rule.validate,
					$dataEle = $(vObject.dataEleSelector),
					$restrictEle = vObject.restrictEleSelector? $(vObject.restrictEleSelector) : $dataEle,
					result,data;
				if($dataEle[0].tagName === 'INPUT' || $dataEle[0].tagName === 'SELECT') {
					data = $dataEle.val();
				} else {
					data = $dataEle.text();
				}
			/*	if(!vObject.msgs) {
					vObject.msgs = [];
				}*/
				vObject.msgs = [];
				result = callback.call(rule,data,$restrictEle);
				if(!result){
					vObject.msgs.push(rule.errorMsg || rule.errorMsgFormat);
				} 
				return result;
			}

			function _createErrorTip(vObject) {
				var $container = $(vObject.errorContainer);
				$container.tooltip({
					trigger : 'click',
					title : vObject.msgs.join(','),
					container : $container
				});
				$container.tooltip('show');
				$container.one('click.distory',function(event){
					$(this).tooltip('destroy');
				});
			}
			
			_initRulesCallback();
		});
	};

	$.fn.validator.rules = {
		required : {
			validate : function(data,$el) {
				return !((data+"").trim() === ""); 
			}
			,errorMsgFormat : '内容不能为空'
		},
		range : {
			validate : function(data,$el) {
				var dataRange = $el.data('range').split(','),
					thisRule = this;
				thisRule.errorMsg = this.errorMsgFormat.replace('%s','[' + dataRange.join(',') + ']');
				return dataRange.some(function(e){return e === data});
			}
			,errorMsgFormat: '内容不能在限定的范围%s之外'
		}
	}

}(window,jQuery,undefined);