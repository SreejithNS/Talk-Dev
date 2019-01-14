//---------initial----------//
var anyCommunity = false;
joinedCommunity();
pendingCommunity();
/*flag 0 for joined community
*flag 1 for pending community
*flag 2 for my community
*/
function createCommunityDivForPanel(response,flag,extClass){
  var badge = '';
  var badge2 = '';
  var panelForwarded = 'discussion';
  var numberUser = '';
  try{
      if(flag==0 || flag==2){
        var panelComImage = response.MyJoinedCommunities[0].communityImage;
        var panelComId = response.MyJoinedCommunities[0]._id;
        var panelComName = response.MyJoinedCommunities[0].communityName;
        if(flag==2)
        {
          numberUser = 'Request('+response.MyJoinedCommunities[0].requests+')';
          numberUser = "<a class='comnametxt-user' href='/community/manageCommunity/"+panelComId+"'>"+numberUser+"</a>";
          badge = '<label class="label label-success" style="cursor:pointer !important;"><i class="fa fa-cogs"></i></label>';
        }else{
          numberUser = 'Members('+response.MyJoinedCommunities[0].totalUsers+')';
          numberUser = "<a class='comnametxt-user' href='/community/communitymembers/"+panelComId+"'>"+numberUser+"</a>";
          badge = '<label class="label label-success" style="cursor:pointer !important;"><i class="fa fa-cogs"></i></label>';
        }
      }else if(flag==1){
        var panelComImage = response.MyAppliedCommunities[0].communityImage;
        var panelComId = response.MyAppliedCommunities[0]._id;
        var panelComName = response.MyAppliedCommunities[0].communityName;
        panelForwarded = 'communityprofile';
        numberUser = 'Members('+response.MyAppliedCommunities[0].totalUsers+')';
        numberUser = "<a class='comnametxt-user' style='text-decoration:none;color:black;cursor:context-menu'>"+numberUser+"</a>";
        badge = '<label class="label label-danger" style="cursor:pointer !important;"><i class="fa fa-times"></i></label>';
        badge2 = '<label class="label label-danger">Pending</label>&nbsp;&nbsp;&nbsp;';
      }
        code="<div class='col-sm-12 col-xs-12 "+extClass+" community-div' style='margin-top:5px;' id='can"+panelComId+"'>";
        code +="<div class='col-sm-1 col-xs-3' style='padding:10px;z-index:1'>";
        code +="<a href='/community/"+panelForwarded+"/"+panelComId+"'><img src='/Upload/CommunityProfile/"+panelComImage+"' class='cpic'></a>";
        code +="</div>";
        code +="<div class='col-sm-10 col-xs-7' style='padding-top:25px;padding-bottom:5px;overflow:scroll'>";
        code +="     <p style='margin:0'><a class='comnametxt' href='/community/"+panelForwarded+"/"+panelComId+"'>"+badge2+panelComName+"</a>&nbsp;&nbsp;&nbsp;"+numberUser+"</p>";
        code +="</div>";
        code +="<div class='col-sm-1 col-xs-2' style='padding:0'>";
        if(flag==1)
        {
          code +="<a class='community-short-btn' onclick='cancelRequest(\""+panelComId+"\")' style='float:right'>";
          code +=badge+"</a>";
        } else if(flag==2)
        {
          code +="<a class='community-short-btn' href='/community/manageCommunity/"+panelComId+"' style='float:rignt'>";
          code +=badge+"</a>";
        }
        code +="</div>";
        code +="</div>";
        anyCommunity = true;
  }catch(err){
    code = '';
  }
  return code;
}
//--------------------------------------------------------------------------------------------------------------------
function pendingCommunity()
{
    $.ajax({
           type: 'POST',
           contentType: 'application/json',
           url: '/community/pendingCommunity',
           success: function (response) {
               $('.pendingCommunity').remove();
               for(i=0;i<response.length;i++)
               {
                 if(response[i].MyAppliedCommunities.length){
                  $('#my-pending-commuity').append(createCommunityDivForPanel(response[i],1,'pendingCommunity'));
                 }
               }
               $('.loading-community-panel-image').remove();
               if(!anyCommunity)
               {
                 var code ="<div class='col-sm-12 joinedCommunity well' style='margin-top:5px;font-weight:bold'>";
                 code +="<center>No any joined community</center><br /><center>";
                 code +="<a class='btn btn-default' href='/community/list'>Click here for more communities</a></center>";
                 code +="</div>";
                 $('#community-that-am-in').append(code);
               }
           },
           error: function (err) {
               notie.alert({type: 3, text:'Something went wrong!', time: 2})
               if(!anyCommunity)
               {
                 var code ="<div class='col-sm-12 joinedCommunity well' style='margin-top:5px;font-weight:bold'>";
                 code +="<center>No any joined community</center><br /><center>";
                 code +="<a class='btn btn-default' href='/community/list'>Click here for more communities</a></center>";
                 code +="</div>";
                 $('#community-that-am-in').append(code);
               }
           }
       });
}
//-----------------------------------------------------------------------------------------------------------------------------
function joinedCommunity()
{
    $.ajax({
           type: 'POST',
           contentType: 'application/json',
           url: '/community/joinedCommunity',
           success: function (response) {
               $('.joinedCommunity').remove();
               $('.myCommunity').remove();
                  //---------------------------
                   for(i=0;i<response.length-1;i++)
                   {
                       if(response[i].MyJoinedCommunities.length)
                       {
                          if(response[i].MyJoinedCommunities[0].userId == response[response.length-1])
                          {
                            $('#can-create-community').append(createCommunityDivForPanel(response[i],2,'myCommunity'));
                          } else {
                            existFlag = true;
                            $('.loading-community-panel-image').remove();
                            $('#community-that-am-in').append(createCommunityDivForPanel(response[i],0,'joinedCommunity'));
                          }
                        }
                    }
                  //---------------------------
           },
           error: function (err) {
               notie.alert({type: 3, text:'Something went wrong!', time: 2})
           }
       });
}
//--------------------------------------------------------------------------------------------------------------------------------
function cancelRequest(id)
{
  $.confirm({
      title: 'Cancel Request',
      content: "Do you really want cancel request...",
      buttons: {
          'Yes': {
              btnClass: 'btn-success',
              action: function () {
                $.ajax({
                       type: 'POST',
                       contentType: 'application/json',
                       data: JSON.stringify({_id:id}),
                       url: '/community/cancelCommunity',
                       success: function (response) {
                         $('#can'+id).remove();
                         pendingCommunity();
                       },
                       error: function (err) {
                           notie.alert({type: 3, text:'Something went wrong!', time: 2})
                       }
                   });
              }
          },
          'No': {btnClass: 'btn-danger',}
      }
  });
}
