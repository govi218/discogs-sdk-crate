import e from"isomorphic-unfetch";import{createInterface as t}from"readline";function o(){return o=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var o=arguments[t];for(var r in o)Object.prototype.hasOwnProperty.call(o,r)&&(e[r]=o[r])}return e},o.apply(this,arguments)}class r{generateNonce(){return Date.now().toString()+Math.random().toString().substring(2)}constructor(e){this.DiscogsConsumerKey=void 0,this.DiscogsConsumerSecret=void 0,this.baseUrl=void 0,this.callbackUrl=void 0,this.userAgent=void 0,this.DiscogsConsumerKey=e.DiscogsConsumerKey,this.DiscogsConsumerSecret=e.DiscogsConsumerSecret,this.baseUrl=e.baseUrl||"https://api.discogs.com",this.callbackUrl=e.callbackUrl||"http://localhost:3000/callback",this.userAgent=e.userAgent||"DefaultUserAgent/1.0"}get consumerKey(){return this.DiscogsConsumerKey}get consumerSecret(){return this.DiscogsConsumerSecret}get callbackUrlGetter(){return this.callbackUrl}get baseUrlGetter(){return this.baseUrl}get userAgentGetter(){return this.userAgent}get nonceGetter(){return this.generateNonce()}generateOAuthHeader(){const e=Date.now().toString(),t=this.generateNonce();return`OAuth oauth_consumer_key="${this.DiscogsConsumerKey}",oauth_signature_method="PLAINTEXT",oauth_timestamp="${e}",oauth_nonce="${t}",oauth_version="1.0",oauth_signature="${this.DiscogsConsumerSecret}&"`}async request(t,r,s){const n=`${this.baseUrl}${t.startsWith("/")?"":"/"}${t}`,a=new Headers({Authorization:this.generateOAuthHeader(),"User-Agent":this.userAgent});s&&"string"==typeof s?a.set("Content-Type","application/x-www-form-urlencoded"):s&&(a.set("Content-Type","application/json"),s=JSON.stringify(s));const i=o({headers:a},r,{body:s,method:(null==r?void 0:r.method)||"GET"}),u=await e(n,i);if(!u.ok){const e=await u.text();throw new Error(`HTTP error ${u.status}: ${e}`)}const c=u.headers.get("Content-Type")||"";if(c.includes("application/json"))return u.json();if(c.includes("application/x-www-form-urlencoded")){const e=await u.text();return new URLSearchParams(e)}throw new Error(`Unsupported content type: ${c}`)}}class s extends r{}var n;n=s,[class extends r{generateTimestamp(){return`${Date.now()}`}createVerificationURL(e){return`https://www.discogs.com/oauth/authorize?oauth_token=${e}`}async getRequestToken(){const e=this.generateTimestamp(),t=new URLSearchParams({oauth_callback:this.callbackUrlGetter,oauth_consumer_key:this.consumerKey,oauth_nonce:this.nonceGetter,oauth_signature_method:"PLAINTEXT",oauth_timestamp:e,oauth_version:"1.0"}).toString(),o=await this.request("oauth/request_token",{method:"POST"},t);return{oauthRequestToken:o.get("oauth_token"),oauthRequestTokenSecret:o.get("oauth_token_secret"),verificationURL:this.createVerificationURL(o.get("oauth_token"))}}async getAccessToken(e){const t=this.generateTimestamp(),o=this.nonceGetter,r=new URLSearchParams({oauth_token:e.oauthToken,oauth_verifier:e.oauthVerifier}).toString(),s={method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded",Authorization:`OAuth oauth_consumer_key="${this.consumerKey}",oauth_signature_method="PLAINTEXT",oauth_timestamp="${t}",oauth_nonce="${o}",oauth_version="1.0",oauth_token="${e.oauthToken}",oauth_verifier="${e.oauthVerifier}",oauth_signature="${this.consumerSecret}&${e.tokenSecret}"`,"User-Agent":this.userAgentGetter}},n=await this.request("oauth/access_token",s,r);return{oauthAccessToken:n.get("oauth_token"),oauthAccessTokenSecret:n.get("oauth_token_secret")}}async getUserIdentity(e){const t={"Content-Type":"application/x-www-form-urlencoded",Authorization:`OAuth oauth_consumer_key="${this.consumerKey}",oauth_token="${e.oauthToken}",oauth_signature_method="PLAINTEXT",oauth_timestamp="${Date.now().toString()}",oauth_nonce="${this.nonceGetter}",oauth_signature="${this.consumerSecret}&${e.oauthTokenSecret}"`,"User-Agent":this.userAgentGetter};return this.request("oauth/identity",{method:"GET",headers:t})}async authenticateAndGetIdentity(){try{const e=await this.getRequestToken();console.log(`Please visit this URL to authorize the application: ${e.verificationURL}`);const o=t({input:process.stdin,output:process.stdout}),r=await new Promise(e=>{o.question("Please enter the OAuth verifier: ",t=>{o.close(),e(t)})}),s=await this.getAccessToken({oauthToken:e.oauthRequestToken,tokenSecret:e.oauthRequestTokenSecret,oauthVerifier:r});return await this.getUserIdentity({oauthToken:s.oauthAccessToken,oauthTokenSecret:s.oauthAccessTokenSecret})}catch(e){throw console.error("Authentication flow failed:",e),e}}}].forEach(e=>{Object.getOwnPropertyNames(e.prototype).forEach(t=>{Object.defineProperty(n.prototype,t,Object.getOwnPropertyDescriptor(e.prototype,t))})});export{s as default};
