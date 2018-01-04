(function(){


  var myApp = angular.module('myApp', ['angularTreeview']);
  myApp.controller('myController', function($scope){

      $scope.printParent = function ($event) {
          var root = $scope;
          var currentScope = angular.element($event.target).scope();
          currentScope = currentScope.$parent;
          while(currentScope.$id !== root.$id) {
              currentScope = currentScope.$parent;
          }
      }

    $scope.treeList = [
        { "fileName" : "Amit", "fileId" : "file1", "children" : [
          { "fileName" : "Amit1", "fileId" : "file11", "collapsed" : true, "children" : [] },
          { "fileName" : "Amit2", "fileId" : "file12", "collapsed" : true, "children" : [
            { "fileName" : "Amit2-1", "fileId" : "file121", "children" : [
              { "fileName" : "Amit2-1-1", "fileId" : "file1211", "children" : [] },
              { "fileName" : "Amit2-1-2", "fileId" : "file1212", "children" : [] }
            ]}
          ]}
        ]},

        { "fileName" : "Ayush", "fileId" : "file2", "children" : [
          { "fileName" : "Ayush1", "fileId" : "file11", "collapsed" : true, "children" : [] },
          { "fileName" : "Ayush2", "fileId" : "file12", "children" : [
            { "fileName" : "Ayush2-1", "fileId" : "file121", "children" : [
              { "fileName" : "Ayush2-1-1", "fileId" : "file1211", "children" : [] },
              { "fileName" : "Ayush2-1-2", "fileId" : "file1212", "children" : [] }
            ]}
          ]}
        ]},

        { "fileName" : "Upsy", "fileId" : "file3", "children" : [
          { "fileName" : "Upsy1", "fileId" : "file11", "children" : [] },
          { "fileName" : "Upsy2", "fileId" : "file12", "collapsed" : true, "children" : [
            { "fileName" : "Upsy2-1", "fileId" : "file121", "children" : [
              { "fileName" : "Upsy2-1-1", "fileId" : "file1211", "children" : [] },
              { "fileName" : "Upsy2-1-2", "fileId" : "file1212", "children" : [] }
            ]}
          ]}
        ]}
      ];

  });

})();

(function ( angular ) {
	'use strict';

	angular.module( 'angularTreeview', [] ).directive( 'treeModel', ['$compile', function( $compile ) {
		return {
			restrict: 'A',
			link: function ( scope, element, attrs ) {

				var treeId = attrs.treeId;
				var treeModel = attrs.treeModel;
				var nodeId = attrs.nodeId || 'id';
				var nodeLabel = attrs.nodeLabel || 'label';
				var nodeChildren = attrs.nodeChildren || 'children';
				var template =
					'<ul>' +
						'<li data-ng-repeat="node in ' + treeModel + '">' +
							'<i class="collapsed" data-ng-show="node.' + nodeChildren + '.length && node.collapsed" data-ng-click="' + treeId + '.selectNodeHead(node)"></i>' +
							'<i class="expanded" data-ng-show="node.' + nodeChildren + '.length && !node.collapsed" data-ng-click="' + treeId + '.selectNodeHead(node)"></i>' +
							'<i class="normal" data-ng-hide="node.' + nodeChildren + '.length"></i> ' +
							'<span data-ng-class="node.selected" data-ng-click="' + treeId + '.selectNodeLabel(node, this)">{{node.' + nodeLabel + '}}</span>' +
							'<div data-ng-hide="node.collapsed" data-tree-id="' + treeId + '" data-tree-model="node.' + nodeChildren + '" data-node-id=' + nodeId + ' data-node-label=' + nodeLabel + ' data-node-children=' + nodeChildren + '></div>' +
						'</li>' +
					'</ul>';


				if( treeId && treeModel ) {

					//root node
					if( attrs.angularTreeview ) {

						//create tree object if not exists
						scope[treeId] = scope[treeId] || {};

						//if node head clicks,
						scope[treeId].selectNodeHead = scope[treeId].selectNodeHead || function( selectedNode ){

							//Collapse or Expand
							selectedNode.collapsed = !selectedNode.collapsed;
						};

						//if node label clicks,
						scope[treeId].selectNodeLabel = scope[treeId].selectNodeLabel || function( selectedNode, selectedNodeScope ){
                            if (selectedNodeScope) {
                                var parentScope = selectedNodeScope.$parent,
                                    index,
                                    targetArray;
                                if (parentScope.node) {
                                    targetArray = parentScope.node.children;
                                } else {
                                    //root node
                                    targetArray = scope[treeModel];
                                }
                                // to insert after the index;
                                if (targetArray.length) {
                                    index = targetArray.indexOf(selectedNode);
                                    if (index !== -1) {
                                        //targetArray.splice(index, 0, newNodeToBeAdded)
                                    }

                                }


                            }

							//remove highlight from previous node
							if( scope[treeId].currentNode && scope[treeId].currentNode.selected ) {
								scope[treeId].currentNode.selected = undefined;
							}

							//set highlight to selected node
							selectedNode.selected = 'selected';

							//set currentNode
							scope[treeId].currentNode = selectedNode;
						};
					}

					//Rendering template.
					element.html('').append( $compile( template )( scope ) );
				}
			}
		};
	}]);
})( angular );
