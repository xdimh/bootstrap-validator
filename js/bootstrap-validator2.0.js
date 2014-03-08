!function(window,$,undefined){

	var Validator = function(config,rules) {
		this.init(config,rules);
	};

	Validator.fn = Validator.prototype = {
		constructor : Validator

		,init : function(config,rules) {
			this._config = config || [],
			this._rules = $.extend({},this.rules,rules || {});
			this.isValidate = true;
		}

		,validate : function() {

				var i,len,vObjectt,tRulesNames,
					tRules = this._rules,
					tConfig = this._config;
				for(i = 0,len=tConfig.length; i < len; i++) {
					vObject = tConfig[i];
					if( vObject.ruleNames && vObject.ruleNames.trim() !== "" ) {
						tRulesNames = vObject.ruleNames.split(" ");
						for(j = 0; j < tRulesNames.length; j++) {
							if(tRulesNames[j] in tRules) {
								if(!this._executeValidate(vObject,tRules[tRulesNames[j]])) {
									this._createErrorTip(vObject);
									this.isValidate = false;
									break;
								}	
							} else {
								throw new Error("no handler map to " + tRulesNames[j]);
							}
						}
					}
				}
		}
		,_executeValidate : function(vObject,rule) {
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

		,_createErrorTip : function(vObject) {
			var $container = $(vObject.errorContainer),
				placement = $container.data('placement');
				$container.tooltip({
					trigger : 'click',
					title : vObject.msgs.join(','),
					container : $container,
					placement : placement
				});
				$container.tooltip('show');
				$container.one('click.distory',function(event){
					$(this).tooltip('destroy');
				});
		}

		,isValid : function() {
			return this.isValidate;
		}

		,rules : {

			required : {
				validate : function(data,$el) {
					return !((data+"").trim() === ""); 
				}
				,errorMsgFormat : '内容不能为空'
			}
			,range : {
				validate : function(data,$el) {
					var dataRange = $el.data('range').split(','),
						thisRule = this;
					thisRule.errorMsg = this.errorMsgFormat.replace('%s','[' + dataRange.join(',') + ']');
					return dataRange.some(function(e){return e === data});
				}
				,errorMsgFormat: '内容不能在限定的范围%s之外'
			}
			,year : {
				validate : function(data,$el) {
					var yearRegex = /^\d{4}年?$/,
						thisRule = this;
					thisRule.errorMsg = this.errorMsgFormat.replace('%s','[' + data + ']');
					return yearRegex.test(data);
				}
				,errorMsgFormat : '年份%s不合法,应该是2010或者2010年两种格式之一'
			}
			,special : {
				validate : function(data,$el) {
					var sRegex = /^[^\s]+\s[^\s]+$/,
						thisRule = this;
					thisRule.errorMsg = this.errorMsgFormat.replace('%s','[' + data + ']');
					return sRegex.test(data);
				}
				,errorMsgFormat : '内容%s不符合特殊数据格式,如果是地址格式为"北京 北京市"'
			}
		 }

	};

 window.Validator = Validator;

}(window,jQuery,undefined);