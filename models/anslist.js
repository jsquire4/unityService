module.exports = function(app){
  var module = {};

  function mkObj(ans, usr){

    if (usr) {
      var obj = {"ans": ans, "usrAns": usr, "correct": false};  
      if (String(ans) === String(usr)) {
        obj.correct = true;
      }
      return obj;
    }

    var obj = {"ans": ans, "usrAns": "No Answer", "correct": false};
    return obj;
    
  }

  function combineKeys(ans, usr) {
    var comObj = {};
    comObj.violStructID = {"id": ans.violStructID};
    comObj.sceneName = {"id": ans.sceneName};
    comObj.indexNumber = {"id": ans.indexNumber};
    comObj.location = {"id": ans.location};

    if (!ans.codeId[0]){
      ans.codeId = "N/A";
    }

    if (usr) { // asserts user answered this set
      if (!usr.codeId[0]) {
        usr.codeId = "N/A";
      }

      if (usr.referral == "None") {
        usr.referral = "N/A";
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

      // return empty user spaces if object does not exist
    comObj.violYN = mkObj(ans.violYN, null);
    comObj.codeId = mkObj(ans.codeId, null);
    comObj.violDescUser = mkObj(ans.violDescUser, null);
    comObj.endanger = mkObj(ans.endanger, null);
    comObj.responsibleParty = mkObj(ans.responsibleParty, null);
    comObj.referral = mkObj(ans.referral, null);
    

    return comObj;
  }

  module.getAnswers = function (answerKey, userAnswers){
    var combined = {};
    for (var i = 0; i < answerKey.length; i++){
      var ans = answerKey[i];
      
      if (userAnswers[i]){
        var usr = userAnswers[i];
        if ((ans.sceneName == usr.sceneName && ans.indexNumber == usr.indexNumber)) {
          combined[i] = combineKeys(ans, usr);
        } else {

        }
       
      } else { // if the user answers for this set don't exist
          combined[i] = combineKeys(ans, null);
        // make answer key object return "did not answer for user spaces"
      }

      
    }
    return combined;
  };

  return module;
}
