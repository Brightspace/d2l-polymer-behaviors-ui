window.D2L = window.D2L || {};

/** @polymerBehavior */
D2L.Dom = {

	findComposedAncestor: function(node, predicate) {
		while (node) {
			if (predicate(node) === true) {
				return node;
			}
			node = this.getComposedParent(node);
		}
		return null;
	},

	getComposedChildren: function(node) {

		if (!node) {
			return null;
		}
		if (node.nodeType !== 1 && node.nodeType !== 9 && node.nodeType !== 11) {
			return null;
		}

		var nodes, children = [];

		if (node.tagName === 'CONTENT') {
			nodes = node.getDistributedNodes();
		} else if (node.tagName === 'SLOT') {
			nodes = node.assignedNodes({flatten: true});
		} else {
			if (node.shadowRoot) {
				node = node.shadowRoot;
			}
			nodes = node.children || node.childNodes;
		}

		for (var i = 0; i < nodes.length; i++) {
			if (nodes[i].nodeType === 1) {
				children.push(nodes[i]);
			}
		}

		return children;

	},

	getComposedParent: function(node) {

		if (node.getDestinationInsertionPoints) {
			var insertionPoints = node.getDestinationInsertionPoints();
			if (insertionPoints && insertionPoints.length > 0) {
				return insertionPoints[0];
			}
		}

		if (node.assignedSlot) {
			return node.assignedSlot;
		}

		if (node.parentNode) {
			return node.parentNode;
		} else if (node.host) {
			return node.host;
		}

		return null;

	},

	isComposedAncestor: function(ancestorNode, node) {
		return this.findComposedAncestor(node, function(node) {
			return (node === ancestorNode);
		}) !== null;
	},

	getOffsetParent: function(node) {
		if (!window.ShadowRoot) {
			return node.offsetParent;
		}

		if (
			!this.getComposedParent(node) ||
			node.tagName === 'BODY' ||
			window.getComputedStyle(node).position === 'fixed'
		) {
			return null;
		}

		let currentNode = this.getComposedParent(node);
		while (currentNode) {
			if (currentNode instanceof ShadowRoot ) {
				currentNode = this.getComposedParent(currentNode);
			}
			const position = window.getComputedStyle(currentNode).position;
			const tagName = currentNode.tagName;

			if (
				(position && position !== 'static') ||
				tagName === 'BODY' ||
				position === 'static' && (tagName === 'TD' || tagName === 'TH' || tagName === 'TABLE')
			) {
				return currentNode;
			}
			currentNode = this.getComposedParent(currentNode);
		}

		return null;
	}

};
