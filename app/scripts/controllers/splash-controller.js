angular.module('app.controllers')
.controller('SplashController', ['$scope','$http', 'authService', '$ionicModal', '$ionicPopup', '$state','$localstorage','pushService', 
	function($scope, $http, authService, $ionicModal, $ionicPopup, $state, $localstorage, pushService){

	//screen.lockOrientation('landscape');
	$scope.form = {
		email: 'anik@kvsocial.com',
		password: 'anik'
	};

	$scope.submitting = false;
	
	$scope.submitForm = function(email, password, signingUp) {

		if(signingUp) {
			$scope.submitting = true;
			authService.registerUser($scope.form).then(function(data){			
				$scope.submitting = false;
				$ionicPopup.alert({
					title: 'Registration Successful',
					template: 'You have registered successfully. Please log in to continue.'
				}).then(function(res) {
					$scope.signingUp = false;
				});
			}).catch(function(data){
				$scope.submitting = false;
				$ionicPopup.alert({
					title: 'Registration Failed',
					template: 'The email address was incorrect or it already exists.'
				}).then(function(res) {
					$scope.signingUp = true;
				});

			});
			return false;
		}

		$scope.submitting = true;
		
		authService.authenticateUser(email,password).then(function(data) {
			pushService.register();
			$scope.submitting = false;
			$localstorage.setObject('userData', { 
				token: data.token, 
				user: data.user,
			});
			$localstorage.setObject('broker', data.user.broker);

			$state.go("app.dashboard")		
		}).catch(function(data){
			$scope.submitting = false;
			$ionicPopup.alert({
				title: 'Login Failed',
				template: 'The email and password is not accepted.'
			}).then(function(res) {
				$scope.signingUp = true;
			});		
		});
	}


}]);