var $ = module.exports = 
{
    init: function()
    {        
        this.data = {};
        this.callBack = {};
        this.createMethod = function(methodName)
        {
            this[methodName] = function(callBack)
            {
                this.callBack[methodName] = callBack; 
                this.runCallBack(methodName);
                return this;
            }
        };
        this.runCallBack = function(method)
        {                    
            if(!method) method = 'then';
            if(this.callBack && $.isFunction(this.callBack[method]) && this.data[method]) 
            {
                this.callBack[method].apply(null, this.data[method]);
            }
        }; 

        this.callSet = function(data, method)
        {
            this.data[method] = data;  
            this.runCallBack(method);
            return this;
        }
        
        this.set = function()
        {                    
            var method = 'then';
            var data = this.set.arguments || [];
            var lastArg = data[$.len(data) - 1];
            if(this[lastArg]) 
            {
                delete data[$.len(data) - 1];
                method = lastArg;
            }        
            return this.callSet(data, method);
        };

        this.resolve = function()
        {
            var data = this.resolve.arguments || [];
            return this.callSet(data, 'then');
        }

        this.reject = function()
        {
            var data = this.reject.arguments || [];
            return this.callSet(data, 'error');
        }
        
        this.createMethod('then'); 
        this.createMethod('error'); 
    },
    each: function(obj, callBack)
    {
        for(var i in obj)
        {
            callBack(i, obj[i]);
        }
    },
    echo: function(str, type)
    {
        if(!type) type = 'log';
        console[type](str);
    },
    dir: function(obj)
    {
        return this.echo(obj, "dir");
    },
    makeVar: function(str)
    {
        return (strReplace([' ', '_', "'", '"', "?", "#", "@", "$", "!", "~", "%", "&", "^", "*", "(", ")", "[", "]", "{", "}", "=", "+", "/", "\\", ";", ","], "-", str)).toLowerCase();
    },
    empty: function (val)
    {
        return !val || val == "" || val == "undefined" || val == "0" || val == NaN || val == undefined;
    },
    len: function (obj)
    {
        if(obj && this.isObject(obj))
            return Object.keys(obj).length;
        else if(obj) return (obj).length;
        else 0;
    },
    isSet: function(i)
    {
        var status = false;
        if(i != null && i && i != "undefined" && i != "" && i != undefined) status = true;
        return status;
    },
    isArray: function(i)
    {
        var status = false;
        if(i && i instanceof Array) status = true;
        return status;
    },
    isObject: function(i)
    {        
        var status = false;
        if(i && (i instanceof Object || typeof i === 'object') && !this.isArray(i)) status = true;
        return status;
    },
    isString: function (i)
    {
        var status = false;
        if(i && i != "undefined" && i != undefined) if(typeof i == "string" || typeof i == "STRING") status = true;
        return status;
    },
    isNumaric: function(i)
    {
        return !i || isNaN(i) ? false : true;
    },
    isFunction: function(functionToCheck) 
    {
        var getType = {};
        return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
    },
    isJson: function (contents)
    {    
        return contents && !this.empty(contents) && $.isString(contents) && 
        (
            (
            this.inArray(contents.substr(0, 1), ["{", "["]) && 
            this.inArray(contents.substr(contents.length - 1, 1), ["}", "]"])
            )
        || contents.substr(0,8) == 'JSON|#:|'
        )
        ? true : false;
    },
    isIP: function (theText)
    {
        if(theText.match(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/i)) return true;
        if(theText.match(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.\*$/i)) return true;
        if(theText.match(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.\*$/i)) return true;
        if(theText.match(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.\*jQuery/i)) return true;        
        else return false;
    },
    inArray: function (val, arr)
    {
        return this.isArray(arr) ? (arr.indexOf(val) > -1 ? true : false) : false;
    },
    arrayKey: function (val, arr)
    {
        return this.isArray(arr) ? arr.indexOf(val) : null;
    },  
    endArray: function (arr)
    {
        return this.isArray(arr) && this.len(arr) > 0 ? arr.slice(-1)[0] : null;
    },
    endArrayKey: function (arr)
    {
        return this.isArray(arr) && this.len(arr) > 0 ? arr.indexOf(this.endArray(arr)) : null;
    },
    arrayRemove: function(index, arr)
    {
        if(!this.isArray(arr)) return false;
        arr.splice(index, 1);
        return arr;
    },
    arrayRemoveByValue: function(value, arr)
    {
        var index = this.arrayKey(value, arr);        
        if(index == -1 || index === null) return arr;
        return this.arrayRemove(index, arr);
    },    
    inObject: function (val, obj)
    {
        if(!this.isObject(obj) && !this.isArray(obj)) return false;

        for(var i in obj)
        {
            if(obj[i] == val) return true;
        }
        
        return false;
    },
    toObject: function(arr) 
    {
        if(this.isObject(arr)) return arr;        

        var obj = {};
        if(this.isArray(arr))
        {
            this.each(arr, function(i, v)
            {
                obj[i] = v;
            });
        }        
        return obj;
    },
    toArray: function(obj)
    {
        if(this.isArray(obj)) return obj;        
        var arr = [];
        if(this.isObject(obj))
        {
            this.each(obj, function(i, v)
            {
                arr.push(v);
            });
        }        
        return arr;
    },
    clone: function(obj) 
    {
        return obj && this.isObject(obj) ? JSON.parse(JSON.stringify(obj)) : obj;
    },
    fromJson: function(data)
    {
        if(this.isObject(data) || this.isArray(data))
        {
            return data;
        }
        else if(this.isJson(data))
        {
            if(data.substr(0,8) == 'JSON|#:|') data = data.substr(8);
            if(this.isJson(data)) return JSON.parse(data);
            else return null;
        }
    },
    toJson: function(data)
    {
        if(!data || (!$.isObject(data) && !$.isArray(data))) return "{}";
        return JSON.stringify(data);
    },
    escapeRegExp: function(string) 
    {
        return this.isString(string) ? string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1") : string;
    },
    strReplace: function (oldStr, newStr, str)
    {    
        if(this.isArray(oldStr))
        {        
            for(var i in oldStr)
            {
                var rpl = oldStr[i];
                var patt = new RegExp(this.escapeRegExp(rpl), 'g');
                str = str.replace(patt, (this.isArray(newStr) ? newStr[i] : newStr));
            }
            return str;
        }
        else 
        {
            var patt = new RegExp(oldStr,'g');
            return str.replace(patt, newStr);
        }
    },
    explode: function (spliter, str)
    {
        if(this.isArray(str)) return str;
        return this.isString(str) ? str.split(spliter) : [];
    },
    implode: function (spliter, arr)
    {
        if(this.isString(arr)) return arr;
        var text = "";
        if(this.isArray(arr))
        {        
            if(!spliter) spliter = ","; 
            for(var i in arr)
            {
                if(text != "") text += spliter;
                text += arr[i];
            }
        } 
        return text;
    },    
    random: function (from, to)
    {
        return Math.floor(Math.random(from) * to+1);
    },
    round: function(num, dec)
    {
        if(!this.isNumaric(num)) return 0;
        if(!dec) dec = 0;
        dec = Math.pow(10, dec);
        return Math.round(num * dec) / dec;
    },
    parseStr: function (obj)
    {        
        return "" + obj;
    },
    objToURL: function(obj)
    {
        if(!obj || !this.isObject(obj)) return obj;
        var querystring = require('querystring');
        return querystring.stringify(obj);
    },
    urlToObj: function(obj)
    {
        if(!obj || (!this.isString(obj))) return obj;
        var querystring = require('querystring');
        obj = this.explode("?", obj);
        obj = obj[1] ? obj[1] : obj[0];
        return querystring.parse(obj);
    },
    hostName: function()
    {
        var os = require("os");
        return os.hostname();
    },
    send: function(host, url, data, method, $options)
    {    
        if(!$options) $options = {};
        var port = $options.port || ($options.https ? 443 : 80);
                
        var $Req = require($options.https ? 'https' : 'http');
        var $run = new $.init();
        $run.createMethod('error');

        var postData = $.parseURL(data);
        port = port ? parseInt(port) : 80;

        method = method ? method.toUpperCase() : "POST";        

        var options = {
        hostname: host,
        port: port,
        path: url,
        json: $options.contentType == 'application/json',
        body: JSON.stringify(data),
        method: method,
        headers: {
            'Content-Type': $options.contentType || 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData)
        }
        };
        var responseData = '';
        var req = $Req.request(options, function(res) 
        {        
            res.setEncoding('utf8');

            res.on('data', function (chunk) 
            {            
                if(!$.empty(chunk)) responseData += chunk;
            });            
            res.on('end', function () 
            {                            
                $run.set($.isJson(responseData) ? $.fromJson(responseData) : responseData);
            });            
        });

        req.on('error', function(e) 
        {
            $run.set(e, 'error');
        });
        req.on('timeout', function(e) 
        {
            $run.set(e, 'error');
        });
        req.on('uncaughtException', function(e) 
        {
            $run.set(e, 'error');
        });
        
        req.write(postData);
        req.end();
        return $run;
    },
    modifyFile: function(src, data)
    {
        var $run = new $.init();
        $run.createMethod("error");

        var fs = require('fs');
        fs.writeFile(src, data, function(err) 
        {
            if(err) {
                $run.set(false, err);
            }
            else $run.set(!err, err);
        }); 

        return $run;
    }
};