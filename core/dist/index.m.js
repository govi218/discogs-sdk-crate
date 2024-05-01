import e from"isomorphic-unfetch";import{createInterface as t}from"readline";function r(e){var t=function(e,t){if("object"!=typeof e||!e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var o=r.call(e,"string");if("object"!=typeof o)return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}(e);return"symbol"==typeof t?t:t+""}function o(){return o=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var o in r)Object.prototype.hasOwnProperty.call(r,o)&&(e[o]=r[o])}return e},o.apply(this,arguments)}function n(e,t){e.prototype=Object.create(t.prototype),e.prototype.constructor=e,i(e,t)}function i(e,t){return i=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(e,t){return e.__proto__=t,e},i(e,t)}var u,s=/*#__PURE__*/function(){function t(e){this.DiscogsConsumerKey=void 0,this.DiscogsConsumerSecret=void 0,this.baseUrl=void 0,this.callbackUrl=void 0,this.userAgent=void 0,this.DiscogsConsumerKey=e.DiscogsConsumerKey,this.DiscogsConsumerSecret=e.DiscogsConsumerSecret,this.baseUrl=e.baseUrl||"https://api.discogs.com",this.callbackUrl=e.callbackUrl||"http://localhost:3000/callback",this.userAgent=e.userAgent||"DefaultUserAgent/1.0"}var n,i,u=t.prototype;return u.generateNonce=function(){return Date.now().toString()+Math.random().toString().substring(2)},u.generateOAuthHeader=function(){var e=Date.now().toString(),t=this.generateNonce();return'OAuth oauth_consumer_key="'+this.DiscogsConsumerKey+'",oauth_signature_method="PLAINTEXT",oauth_timestamp="'+e+'",oauth_nonce="'+t+'",oauth_version="1.0",oauth_signature="'+this.DiscogsConsumerSecret+'&"'},u.request=function(t,r,n){try{var i=this,u=i.baseUrl+(t.startsWith("/")?"":"/")+t,s=new Headers({Authorization:i.generateOAuthHeader(),"User-Agent":i.userAgent});n&&"string"==typeof n?s.set("Content-Type","application/x-www-form-urlencoded"):n&&(s.set("Content-Type","application/json"),n=JSON.stringify(n));var a=o({headers:s},r,{body:n,method:(null==r?void 0:r.method)||"GET"});return Promise.resolve(e(u,a)).then(function(e){function t(t){var r=e.headers.get("Content-Type")||"";if(r.includes("application/json"))return e.json();if(r.includes("application/x-www-form-urlencoded"))return Promise.resolve(e.text()).then(function(e){return new URLSearchParams(e)});throw new Error("Unsupported content type: "+r)}var r=function(){if(!e.ok)return Promise.resolve(e.text()).then(function(t){throw new Error("HTTP error "+e.status+": "+t)})}();return r&&r.then?r.then(t):t()})}catch(e){return Promise.reject(e)}},n=t,(i=[{key:"consumerKey",get:function(){return this.DiscogsConsumerKey}},{key:"consumerSecret",get:function(){return this.DiscogsConsumerSecret}},{key:"callbackUrlGetter",get:function(){return this.callbackUrl}},{key:"baseUrlGetter",get:function(){return this.baseUrl}},{key:"userAgentGetter",get:function(){return this.userAgent}},{key:"nonceGetter",get:function(){return this.generateNonce()}}])&&function(e,t){for(var o=0;o<t.length;o++){var n=t[o];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,r(n.key),n)}}(n.prototype,i),Object.defineProperty(n,"prototype",{writable:!1}),n}(),a=/*#__PURE__*/function(e){function r(){return e.apply(this,arguments)||this}n(r,e);var o=r.prototype;return o.generateTimestamp=function(){return""+Date.now()},o.createVerificationURL=function(e){return"https://www.discogs.com/oauth/authorize?oauth_token="+e},o.getRequestToken=function(){try{var e=this,t=e.generateTimestamp(),r=new URLSearchParams({oauth_callback:e.callbackUrlGetter,oauth_consumer_key:e.consumerKey,oauth_nonce:e.nonceGetter,oauth_signature_method:"PLAINTEXT",oauth_timestamp:t,oauth_version:"1.0"}).toString();return Promise.resolve(e.request("oauth/request_token",{method:"POST"},r)).then(function(t){return{oauthRequestToken:t.get("oauth_token"),oauthRequestTokenSecret:t.get("oauth_token_secret"),verificationURL:e.createVerificationURL(t.get("oauth_token"))}})}catch(e){return Promise.reject(e)}},o.getAccessToken=function(e){try{var t=this,r=t.generateTimestamp(),o=t.nonceGetter,n=new URLSearchParams({oauth_token:e.oauthToken,oauth_verifier:e.oauthVerifier}).toString();return Promise.resolve(t.request("oauth/access_token",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded",Authorization:'OAuth oauth_consumer_key="'+t.consumerKey+'",oauth_signature_method="PLAINTEXT",oauth_timestamp="'+r+'",oauth_nonce="'+o+'",oauth_version="1.0",oauth_token="'+e.oauthToken+'",oauth_verifier="'+e.oauthVerifier+'",oauth_signature="'+t.consumerSecret+"&"+e.tokenSecret+'"',"User-Agent":t.userAgentGetter}},n)).then(function(e){return{oauthAccessToken:e.get("oauth_token"),oauthAccessTokenSecret:e.get("oauth_token_secret")}})}catch(e){return Promise.reject(e)}},o.getUserIdentity=function(e){try{var t=this,r={"Content-Type":"application/x-www-form-urlencoded",Authorization:'OAuth oauth_consumer_key="'+t.consumerKey+'",oauth_token="'+e.oauthToken+'",oauth_signature_method="PLAINTEXT",oauth_timestamp="'+Date.now().toString()+'",oauth_nonce="'+t.nonceGetter+'",oauth_signature="'+t.consumerSecret+"&"+e.oauthTokenSecret+'"',"User-Agent":t.userAgentGetter};return Promise.resolve(t.request("oauth/identity",{method:"GET",headers:r}))}catch(e){return Promise.reject(e)}},o.authenticateAndGetIdentity=function(){try{var e=this;return Promise.resolve(function(r,o){try{var n=Promise.resolve(e.getRequestToken()).then(function(r){console.log("Please visit this URL to authorize the application: "+r.verificationURL);var o=t({input:process.stdin,output:process.stdout});return Promise.resolve(new Promise(function(e){o.question("Please enter the OAuth verifier: ",function(t){o.close(),e(t)})})).then(function(t){return Promise.resolve(e.getAccessToken({oauthToken:r.oauthRequestToken,tokenSecret:r.oauthRequestTokenSecret,oauthVerifier:t})).then(function(t){return Promise.resolve(e.getUserIdentity({oauthToken:t.oauthAccessToken,oauthTokenSecret:t.oauthAccessTokenSecret}))})})})}catch(e){return o(e)}return n&&n.then?n.then(void 0,o):n}(0,function(e){throw console.error("Authentication flow failed:",e),e}))}catch(e){return Promise.reject(e)}},r}(s),c=/*#__PURE__*/function(e){function t(){return e.apply(this,arguments)||this}return n(t,e),t}(s);u=c,[a].forEach(function(e){Object.getOwnPropertyNames(e.prototype).forEach(function(t){Object.defineProperty(u.prototype,t,Object.getOwnPropertyDescriptor(e.prototype,t))})});export{c as default};
