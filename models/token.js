var crypto = require("crypto");
const {timeStamp} = require("console");

const client = require("./client");

var algorithm = "aes-192-cbc";
var password = "*insert_secret_key_here*";

const key = crypto.scryptSync(password, 'salt', 24);
const iv = Buffer.alloc(16, 0);

const authWindow = 30 * 60 * 1000;


// Class Token contains the implementation required for auth token operations,
// including token creation and obtaining user details post credential verification
function Token(authToken) {
	this.authToken = authToken;
}

Token.prototype.generateToken = function (userID, clientID) {
	const cipher = crypto.createCipheriv(algorithm, key, iv);

	let requestDate = new Date();
	let infoString = userID + "___" + clientID + "___" + requestDate;

	this.authToken = cipher.update(infoString, 'utf8', 'hex') + cipher.final('hex');
};

Token.prototype.getUserProfile = function (clientSecret) {
	var decrytedToken = this.decrptyToken();
	ldap = decrytedToken.split("___")[0];
	clientID = decrytedToken.split("___")[1];
	requestDate = new Date(decrytedToken.split("___")[2]).getTime();

	if (new Date() <= new Date(requestDate + authWindow)) {
		thisClient = new client(clientID, clientSecret, "");
		if (thisClient.assertClientCreds()) {
			// return getUser(ldap)
		}
		//return client invalid error
	}
	//return auth window expired error
};


Token.prototype.decrptyToken = function () {
	const decipher = crypto.createDecipheriv(algorithm, key, iv);
	return decipher.update(this.authToken, 'hex', 'utf8') + decipher.final('utf8');
};

module.exports = Token;