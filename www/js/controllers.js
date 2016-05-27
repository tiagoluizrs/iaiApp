/* global angular, document, window */
'use strict';

angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $ionicPopover, $state, $timeout, factoryGeneral, $http, $localStorage) {
    // Form data for the login modal
    $scope.loginData = {};
    $scope.isExpanded = false;
    $scope.hasHeaderFabLeft = false;
    $scope.hasHeaderFabRight = false;
    // Variáveis
    $scope.profile = factoryGeneral.profile;
    $scope.projects = factoryGeneral.projects;
    $scope.tasks = factoryGeneral.tasks;
    $scope.updates = factoryGeneral.updates;
    $scope.latests = factoryGeneral.latests;
    $scope.logoutL = factoryGeneral.logoutL;


    var navIcons = document.getElementsByClassName('ion-navicon');
    for (var i = 0; i < navIcons.length; i++) {
        navIcons.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    }

    ////////////////////////////////////////
    // Layout Methods
    ////////////////////////////////////////

    $scope.hideNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
    };

    $scope.showNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
    };

    $scope.noHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }
    };

    $scope.setExpanded = function(bool) {
        $scope.isExpanded = bool;
    };

    $scope.setHeaderFab = function(location) {
        var hasHeaderFabLeft = false;
        var hasHeaderFabRight = false;

        switch (location) {
            case 'left':
                hasHeaderFabLeft = true;
                break;
            case 'right':
                hasHeaderFabRight = true;
                break;
        }

        $scope.hasHeaderFabLeft = hasHeaderFabLeft;
        $scope.hasHeaderFabRight = hasHeaderFabRight;
    };

    $scope.hasHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (!content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }

    };

    $scope.hideHeader = function() {
        $scope.hideNavBar();
        $scope.noHeader();
    };

    $scope.showHeader = function() {
        $scope.showNavBar();
        $scope.hasHeader();
    };

    $scope.clearFabs = function() {
        var fabs = document.getElementsByClassName('button-fab');
        if (fabs.length && fabs.length > 1) {
            fabs[0].remove();
        }
    };

    $scope.preloaderUser = true;
    $scope.instante = true;
    $scope.contaUser = true;
    $scope.contaSync = true;
    $scope.contaError = true;
    $scope.contaInvalid = true;
    $scope.contaInactive = true;

    
    $scope.isLoggedIn = $localStorage.isLoggedIn;
    
    // LocalStorage
    if($scope.isLoggedIn){

      $scope.preloaderUser = false;
      $scope.instante = false;
       $timeout(function() {
            $scope.preloaderUser = true;
            $scope.instante = true;
            $state.go('app.profile'); 
        }, 3000);
    }else{
      $state.go('app.login');
    }

    $scope.logout = function(){
        delete $localStorage.user;
        delete $localStorage.isLoggedIn;
        $scope.isLoggedIn = false;
        $state.go('app.login');
    };

    $scope.submit = function(user){
        if(user.email == '' || user.password == ''){
            alert('Preencha os campos em Branco!!!');
        }else{
            $scope.preloaderUser = false;
            $scope.instante = false;
            var $promise = $http.get('http://upwsites.com.br/system/UserApp?email='+user.email+'&password='+user.password)
                .then(function success(response){
                    $scope.contaUser = false;
                    $scope.instante = true;
                    if(response.data != ''){
                        $timeout(function() {
                            $scope.contaUser = true;
                            $scope.contaSync = false;
                        }, 3000);
                        if(response.data[0][0].estado != undefined && response.data[0][0].estado == 1){
                            $localStorage.user = response.data[0][0];
                            $localStorage.isLoggedIn = true;
                            $timeout(function() {
                                $scope.preloaderUser = true;
                                $scope.contaSync = true;
                                $state.go('app.profile');
                            }, 2000);
                        }else{
                            $scope.contaUser = true;
                            $scope.contaSync = true;
                            $scope.contaError = true;
                            $scope.contaInvalid = true;
                            $scope.contaInactive = false;
                            $timeout(function() {
                                    $scope.preloaderUser = true;
                                    $scope.contaInvalid = true;
                                }, 2000);
                            }
                    }else{  
                        $scope.contaUser = true;
                        $scope.contaSync = true;
                        $scope.contaError = true;
                        $scope.contaInvalid = false;
                        $timeout(function() {
                                $scope.preloaderUser = true;
                                $scope.contaInvalid = true;
                            }, 2000);
                    }
                    // console.log(response.data);
                }, function error(response){
                    return 0;
                });
        }
    };
    
})

.controller('LoginCtrl', function($scope, $timeout, $stateParams, ionicMaterialInk, $ionicSideMenuDelegate, $location, factoryGeneral) {
    $scope.$parent.clearFabs();
    $timeout(function() {
        $scope.$parent.hideHeader();
    }, 0);
    ionicMaterialInk.displayEffect();

    // Arrastar ou não do Menu
    $ionicSideMenuDelegate.canDragContent(false);
})

.controller('ProfileCtrl', function($scope, $stateParams, $timeout, ionicMaterialMotion, $localStorage, ionicMaterialInk, $ionicSideMenuDelegate, $ionicNavBarDelegate, factoryGeneral, $http) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);
    $ionicNavBarDelegate.showBackButton(false);

    
    if($localStorage.user){
        console.log($localStorage.user);
        $scope.userId = $localStorage.user.id;
        $scope.userName = $localStorage.user.nome;
        $scope.isLoggedIn = $localStorage.isLoggedIn;
    }
    // Arrastar ou não do Menu
    $ionicSideMenuDelegate.canDragContent(true);
    // Set Motion
    $timeout(function() {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 300);

    $timeout(function() {
        ionicMaterialMotion.fadeSlideInRight({
            startVelocity: 3000
        });
    }, 700);

    // Set Ink
    ionicMaterialInk.displayEffect();

    $scope.projectsItem = [
        {
            title: 'Desenvolver WebSite para Google',
            date: new Date,
            image: 'google-material.png',
            id: 1,
        },
        {
            title: 'Desenvolver Sistema para Microsoft',
            date: new Date,
            image: 'microsoft.png',
            id: 2,
        },
        {
            title: 'Desenvolver WebSite para Ubuntu',
            date: new Date,
            image: 'ubuntu.png',
            id: 3,
        },
        {
            title: 'Desenvolver WebSite para Adobe',
            date: new Date,
            image: 'adobe.png',
            id: 4,
        },
    ]

    // Variáveis
    $scope.projects = factoryGeneral.projects;
    $scope.tasks = factoryGeneral.tasks;
    $scope.updates = factoryGeneral.updates;
    $scope.latests = factoryGeneral.latests;

    // $http.get('http://upwsites.com.br/system/UserApp?email=tiago@gmail.com&password=123')
    // .success(function(response){
    //     $scope.teste = response[2][0].titulo;
    // });
})

.controller('ProjectsCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion, $ionicSideMenuDelegate, $ionicNavBarDelegate, factoryGeneral) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.$parent.setHeaderFab('left');
    $ionicNavBarDelegate.showBackButton(true);

    // Arrastar ou não do Menu
    $ionicSideMenuDelegate.canDragContent(true);

    // Delay expansion
    $timeout(function() {
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(true);
    }, 300);

    // Set Motion
    ionicMaterialMotion.fadeSlideInRight();

    // Set Ink
    ionicMaterialInk.displayEffect();

    // Variáveis
    $scope.projects = factoryGeneral.projects;

    $scope.projectsItem = [
        {
            title: 'Desenvolver WebSite para Google',
            date: new Date,
            image: 'google-material.png',
            id: 1,
        },
        {
            title: 'Desenvolver Sistema para Microsoft',
            date: new Date,
            image: 'microsoft.png',
            id: 2,
        },
        {
            title: 'Desenvolver WebSite para Ubuntu',
            date: new Date,
            image: 'ubuntu.png',
            id: 3,
        },
        {
            title: 'Desenvolver WebSite para Adobe',
            date: new Date,
            image: 'adobe.png',
            id: 4,
        },
    ]
})

.controller('UpdatesCtrl', function($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk, $ionicSideMenuDelegate, $ionicNavBarDelegate, factoryGeneral) {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab('right');
    $ionicNavBarDelegate.showBackButton(true);

    // Arrastar ou não do Menu
    $ionicSideMenuDelegate.canDragContent(true);

    $timeout(function() {
        ionicMaterialMotion.fadeSlideIn({
            selector: '.animate-fade-slide-in .item'
        });
    }, 200);

    // Activate ink for controller
    ionicMaterialInk.displayEffect();

    // Variáveis
    $scope.updates = factoryGeneral.updates;

    $scope.updatesItem = [
        {
            user: 'Tiago Luiz',
            action: 'Concluiu uma tarefa em',
            project: 'Projeto Google',
            date: new Date,
            image: 'user1.jpg',
            assets: [
                {
                    assetSing: 'asset1.png'
                }, 
                {
                    assetSing: 'asset2.jpg'
                }, 
                {
                    assetSing: 'asset3.jpg'
                }
            ],
            project_id: 1,
        },
        {
            user: 'Brendha França',
            action: 'Concluiu uma tarefa em',
            project: 'Projeto Google',
            date: new Date,
            image: 'user2.jpg',
            assets: [
                {
                    assetSing: 'asset1.png'
                }, 
                {
                    assetSing: 'asset2.jpg'
                }, 
                {
                    assetSing: 'asset3.jpg'
                }
            ],
            project_id: 1,
        },
        {
            user: 'Victor Ferreira',
            action: 'Concluiu uma tarefa em',
            project: 'Projeto Adobe',
            date: new Date,
            image: 'user3.jpg',
            assets: [
                {
                    assetSing: 'asset1.png'
                }, 
                {
                    assetSing: 'asset2.jpg'
                }, 
                {
                    assetSing: 'asset3.jpg'
                }
            ],
            project_id: 1,
        },
        {
            user: 'Diogo Souza',
            action: 'Concluiu uma tarefa em',
            project: 'Projeto Google',
            date: new Date,
            image: 'user4.jpg',
            assets: [
                {
                    assetSing: 'asset1.png'
                }, 
                {
                    assetSing: 'asset2.jpg'
                }, 
                {
                    assetSing: 'asset3.jpg'
                }
            ],
            project_id: 1,
        },
        {
            user: 'José França',
            action: 'Concluiu uma tarefa em',
            project: 'Projeto Ubuntu',
            date: new Date,
            image: 'user5.jpg',
            assets: [
                {
                    assetSing: 'asset1.png'
                }, 
                {
                    assetSing: 'asset2.jpg'
                }, 
                {
                    assetSing: 'asset3.jpg'
                }
            ],
            project_id: 1,
        },
        {
            user: 'Victor Souza',
            action: 'Concluiu uma tarefa em',
            project: 'Projeto Microsoft',
            date: new Date,
            image: 'user6.jpg',
            assets: [
                {
                    assetSing: 'asset1.png'
                }, 
                {
                    assetSing: 'asset2.jpg'
                }, 
                {
                    assetSing: 'asset3.jpg'
                }
            ],
            project_id: 1,
        },
    ]
})

.controller('TasksCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion, $ionicSideMenuDelegate, $ionicNavBarDelegate, factoryGeneral) {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab(false);
    $ionicNavBarDelegate.showBackButton(true);

    // Arrastar ou não do Menu
    $ionicSideMenuDelegate.canDragContent(true);

    // Activate ink for controller
    ionicMaterialInk.displayEffect();

    ionicMaterialMotion.pushDown({
        selector: '.push-down'
    });
    ionicMaterialMotion.fadeSlideInRight({
        selector: '.animate-fade-slide-in .item'
    });

    // Variáveis
    $scope.tasks = factoryGeneral.tasks;

    $scope.tasksItem = [
        {
            title: 'Desenvolver Interface do Site Google',
            date: new Date,
            image: 'google-material.png',
            number: 1,
        },
        {
            title: 'Interface do Site Microsoft',
            date: new Date,
            image: 'microsoft.png',
            number: 2,
        },
        {
            title: 'Interface do Site Ubuntu',
            date: new Date,
            image: 'ubuntu.png',
            number: 3,
        },
        {
            title: 'Interface do Site Adobe',
            date: new Date,
            image: 'adobe.png',
            number: 4,
        },
    ]
})

;
