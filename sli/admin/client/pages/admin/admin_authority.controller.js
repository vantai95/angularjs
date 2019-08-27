"use strict";
app.controller("AdminAuthorityController", AdminAuthorityController);

function AdminAuthorityController($scope, $rootScope, $ksHttp, $uibModal,
		$location, $timeout, $state, $filter) {
	$scope.adminGroupList = [];
	$scope.IsVisible = null;
	$scope.msCds = [];
	$scope.groupNm = null;
	$scope.group_menus = [];
	$scope.menu_sub_list = [];
	$scope.sub_menus = [];
	$scope.checkall = false;

	$scope.init = function() {
		$scope.getAdminGroupList();
		$scope.getMenuMasterList();
		$scope.getMenuSubList();
	};

	$scope.getAdminGroupList = function() {
		var params = {}
		$ksHttp.post('AdminGroupList', params).then(function(rs) {
			$scope.adminGroupList = JSON.parse(rs);
		}, function(error) {
			console.error(error);
		});
	};

	$scope.getMenuMasterList = function() {
		var params = {}
		$ksHttp.post('MenuMasterList', params).then(function(rs) {
			$scope.menu_master_list = JSON.parse(rs);
		}, function(error) {
			console.error(error);
		});
	};

	$scope.getMenuSubList = function() {
		var params = {}
		$ksHttp.post('MenuSubList', params).then(function(rs) {
			$scope.sub_menus = JSON.parse(rs);
			if ($scope.sub_menus && $scope.sub_menus.length > 0) {
				var data = {};
				$.each($scope.sub_menus, function(value, key) {
					var temp = data[key.muCd];
					if (!temp) {
						temp = [];
					}

					temp.push(key);
					data[key.muCd] = temp;
				});
				$scope.menu_sub_list = data;
			}
		}, function(error) {
			console.error(error);
		});
	};

	$scope.ShowHide = function(index) {
		$scope.IsVisible = index;
	};

	$scope.arCd = null;

	$scope.getGroupMenuList = function(arCd) {

		$scope.arCd = arCd;
		var params = {
			arCd : $scope.arCd
		};

		$ksHttp.post('GroupMenuList', params).then(function(rs) {
			$scope.group_menus = JSON.parse(rs);
			angular.forEach($scope.group_menus, function(value, key) {
				var object = $filter('filter')($scope.sub_menus, {
					'msCd' : value.msCd
				});
				value.checked = false;
				if (object != null) {
					value.muCd = object[0].muCd;
				}

			});

			$scope.updateCheckAllForGroup();

		}, function(error) {
			console.error(error);
		});
		//    	
		$scope.updateCheckAllForGroup = function() {
			angular.forEach($scope.menu_master_list,
					function(menu_master_list) {
						menu_master_list.checked = false;
					});

			angular.forEach($scope.menu_sub_list, function(sub_items, key) {
				angular.forEach(sub_items, function(x) {
					x.checked = false;
				});
			});

			angular.forEach($scope.group_menus, function(value, key) {
				
				angular.forEach($scope.menu_sub_list[value.muCd], function(
						menu_sub_list, pos) {
					if (menu_sub_list.msCd == value.msCd) {
						menu_sub_list.checked = true;
					}
				});

				var total_submenu = ($filter('filter')($scope.sub_menus, {
					'muCd' : value.muCd
				})).length;
				var total_items = ($filter('filter')($scope.group_menus, {
					'muCd' : value.muCd
				})).length;
				var data = $filter('filter')($scope.menu_master_list, {
					'muCd' : value.muCd
				});
				if (total_submenu == total_items) {
					$scope.selectSubItem(data[0]);
				}

			});

			var total_menu = $scope.sub_menus.length;
			var total_group = $scope.group_menus.length;
			$scope.checkall = (total_menu == total_group);

		};

		$scope.upItem = function(index) {
			
			var params = {
				saveType : 'S',
				arCd : arCd,
				displayOrder : index,
				arrowType : 'U',
				updUser : $rootScope.current_user.userId
			};
			
			if( index < 2 ) return;
			
			$ksHttp.post('AdminGroupSave', params).then(function(rs) {
				rs = JSON.parse(rs);
				$scope.ShowHide(rs[0].changeNo);
				$scope.getAdminGroupList();
			}, function(error) {
				$rootScope.showMessage('error', '[오류] 관리자에게 문의해주세요.');
				console.error(error);
			});
		};

		$scope.dowItem = function(index) {
			var params = {
				saveType : 'S',
				arCd : arCd,
				displayOrder : index,
				arrowType : 'D',
				updUser : $rootScope.current_user.userId
			};
			
			$ksHttp.post('AdminGroupSave', params).then(function(rs) {
				rs = JSON.parse(rs);
				$scope.ShowHide(rs[0].changeNo);
				$scope.getAdminGroupList();
			}, function(error) {
				$rootScope.showMessage('error', '[오류] 관리자에게 문의해주세요.');
				console.error(error);
			});
		};
	};
	
	$scope.selectAll = function(){
		angular.forEach($scope.menu_master_list, function(item) {
			item.checked = $scope.checkall;
			
			var sub_list = $scope.menu_sub_list[item.muCd];
			angular.forEach(sub_list, function(sub_item) {
				sub_item.checked = $scope.checkall;
			});
		});
	};

	$scope.selectMasterItem = function(item) {
		var sub_list = $scope.menu_sub_list[item.muCd];
		
		angular.forEach(sub_list, function(sub_item) {
			sub_item.checked = item.checked;
		});
		var checked_items = $.grep($scope.menu_master_list, function(x, i){return x.checked;});
		$scope.checkall = $scope.menu_master_list.length == checked_items.length;
	};

	$scope.selectSubItem = function(master_item) {
		var sub_list = $scope.menu_sub_list[master_item.muCd];
		var checked_sub_items = $.grep(sub_list, function(x, i){return x.checked;});
		master_item.checked = sub_list.length == checked_sub_items.length;
		var checked_items = $.grep($scope.menu_master_list, function(x, i){return x.checked;});
		$scope.checkall = $scope.menu_master_list.length == checked_items.length;
	};

	$scope.add = function() {
		if (!$scope.arCd) {
			$rootScope.showAlert('관리자그룹을 선택해주세요.');
		}
		$scope.msCds = [];
		angular.forEach($scope.menu_sub_list, function(sub_items, key) {
			angular.forEach(sub_items, function(x) {
				if (x.checked)
					$scope.msCds.push(x.msCd.toString());
			});
		});
		$scope.msCds.join(",");
		//console.log($scope.msCds);

		var params = {
			arCd : $scope.arCd,
			regUser : $rootScope.current_user.userId,
			msCds : $scope.msCds.toString()
		};

		$ksHttp.post('MenuAuthSave', params).then(
				function(rs) {
					rs = JSON.parse(rs);
					var message = rs[0].message;
					var status = rs[0].result;
					$rootScope.showMessage($rootScope.getMessageType(status),
							message);
					status == 'succ' ? $state.go("app.admin.authority")
							: $state.reload();
				}, function(error) {
					$rootScope.showMessage('error', '[오류] 관리자에게 문의해주세요.');
					console.error(error);
				});
	};

	$scope.insertAdminGroup = function() {
		$rootScope.showConfirm('그룹을 추가하시겠습니까?', function() {
			if ($.trim($scope.groupNm) == '') {
				var required_msg = $scope.$parent.app.required_msg;
				$rootScope.showAlert('관리자 그룹관리' + required_msg.textbox);
				return false;
			}
			var params = {
				saveType : 'I',
				groupNm : $scope.groupNm,
				regUser : $rootScope.current_user.userId
			};

			$ksHttp.post('AdminGroupSave', params).then(
					function(rs) {
						rs = JSON.parse(rs);
						var message = rs[0].message;
						var status = rs[0].result;
						$rootScope.showMessage($rootScope
								.getMessageType(status), message);
						$scope.getAdminGroupList();
						$scope.groupNm = '';
						$rootScope.showMessage('success', '추가되었습니다.');
					}, function(error) {
						$rootScope.showMessage('error', '[오류] 관리자에게 문의해주세요.');
						console.error(error);
					});
		});
	};

	$scope.deleteItem = function(id) {
		
		/************************************************
		 * 중요 1000~1002 그룹이 변경될 시, 해당 그룹으로 하드코딩되어있는 로직부분은 찾아서 변경해줘야 함. 
		 * 1) 고객사 관리 > 고객사담당자, 영업담당자 호출 api 
		 * 2) 프로시저 SaveAdminUser
		 ************************************************/
		if( id == '1000'){
			$rootScope.showMessage('error', '[삭제불가] 총 관리자 그룹은 삭제할 수 없습니다.');
			return;
		}else if(id == '1001'){
			$rootScope.showMessage('error', '[삭제불가] 고객사관리자 그룹은 삭제할 수 없습니다.');
			return;
		}else if(id == '1002'){
			$rootScope.showMessage('error', '[삭제불가] 영업관리자 그룹은 삭제할 수 없습니다.');
			return;
		}
			
		var totalcnt = 0;
		$rootScope.showConfirm('해당 그룹을 삭제하시겠습니까?', function() {
			var params = {
				arCd : id
			}
			$ksHttp.post('AdminGroupUserListCnt', params).then(function(rs) {
				rs = JSON.parse(rs);
				totalcnt = rs[0].totalcnt;
				if (totalcnt <= 0) {
					var params = {
						saveType : 'D',
						arCd : id,
						updUser : $rootScope.current_user.userId
					}
					$ksHttp.post('AdminGroupSave', params).then(function(rs) {
						$scope.getAdminGroupList();
						$rootScope.showMessage('success', '삭제되었습니다.');
					}, function(error) {
						$rootScope.showMessage('danger', '[오류] 관리자에게 문의해주세요.');
						console.error(error);
					});

				} else {
					$rootScope.showAlert('[삭제불가] 해당 그룹에 등록 되어있는 유저가 있습니다');
				}
			}, function(error) {
				console.error(error);
			});
		});
	}

}