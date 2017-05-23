module.exports = function(app){
  var module = {};

  function mkObj(ans, usr){
    var obj = {"ans": ans, "usrAns": usr, "correct": false};  
    if (ans == usr) {
      obj.correct = true;
    }
    return obj;
  }

  function combineKeys(ans, usr) {
    var comObj = {};
    comObj.violStructID = {"id": ans.violStructID, "description": true};
    comObj.sceneName = {"id": ans.sceneName, "description": false};
    comObj.indexNumber = {"id": ans.indexNumber, "description": false};

    if (!ans.codeId[0]){
      ans.codeId = "N/A";
    }
    if (!usr.codeId[0]){
      usr.codeId = "N/A";
    }

    //really it would be better to loop through this, but I can never seem to get it to work
    comObj.violYN = mkObj(ans.violYN, usr.violYN);
    comObj.codeId = mkObj(ans.codeId, usr.codeId);
    comObj.violDescUser = mkObj(ans.violDescUser, usr.violDescUser);
    comObj.endanger = mkObj(ans.endanger, usr.endanger);
    comObj.responsibleParty = mkObj(ans.responsibleParty, usr.responsibleParty);
    comObj.referral = mkObj(ans.referral, usr.referral);

    // Trying not to mark the free response wrong just because of textual mismatch
    comObj.violDescUser.correct = "Variable";
    return comObj;
  }

  module.getAnswers = function (answerKey, userAnswers){
    var combined = {};
    for (var i = 0; i < answerKey.length; i++){
      var ans = answerKey[i];
      var usr = userAnswers[i];

      if ((ans.sceneName == usr.sceneName && ans.indexNumber == usr.indexNumber)) {
        combined[i] = combineKeys(ans, usr);
      } else {
        combined[i] = "Error";
      }
    }
    return combined;
  };

  return module;
}
