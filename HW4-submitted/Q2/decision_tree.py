from util import entropy, information_gain, partition_classes
import numpy as np 
import ast

class DecisionTree(object):
    def __init__(self):
        # Initializing the tree as an empty dictionary or list, as preferred
        self.tree = self.empty_node()

    def learn(self, X, y):
        # -> None
        # TODO: Train the decision tree (self.tree) using the the sample X and labels y
        # You will have to make use of the functions in utils.py to train the tree
        
        # One possible way of implementing the tree:
        #    Each node in self.tree could be in the form of a dictionary:
        #       https://docs.python.org/2/library/stdtypes.html#mapping-types-dict
        #    For example, a non-leaf node with two children can have a 'left' key and  a 
        #    'right' key. You can add more keys which might help in classification
        #    (eg. split attribute and split value)
        y = list(map(int, y))
        self._make_tree(self.tree, X, y)

    def _make_tree(self, root, X, y, depth=0):
        # -> None
        # print('-' * depth, y)
        # stopping criterion: is leaf_node
        if len(np.unique(y)) == 1:
            root['label'] = np.unique(y)[0]
            # print('a leaf node is reached!')
            return

        # For an attribute, select the split value as mean (continuous case) / majority class (discrete case)
        # For all attributes, select the most informative attribute by argmax on information gain
        n_features = np.array(X).shape[1]
        partitions = [ partition_classes(X, y, i, self.split_value(X, i)) for i in range(n_features) ]
        attribute = np.argmax([ information_gain(y, [y_left, y_right]) for X_left, X_right, y_left, y_right in partitions ])
        root['left'] = self.empty_node()
        root['right'] = self.empty_node()
        root['split_attribute_index'] = attribute
        root['split_value'] = self.split_value(X, attribute)

        X_left, X_right, y_left, y_right = partitions[attribute]
        # stopping criterion: mixed-class data has similar indistinguishable attribute values
        if len(X_left) == 0 or len(X_right) == 0:
            root['label'] = np.bincount(y).argmax()
            # print('a leaf node is reached!')
            return

        # FIX: Partition failed, infinite recursion
        # print('max min mean: ', max(X[:, attribute]), min(X[:, attribute]), root['split_value'])
        # print('X_left X_right sizes: ', len(X_left), len(X_right))
        self._make_tree(root['left'], X_left, y_left, depth+1)
        self._make_tree(root['right'], X_right, y_right, depth+1)

    def classify(self, record):
        # -> int
        # TODO: classify the record using self.tree and return the predicted label
        return self._traverse_tree(self.tree, record)

    def _traverse_tree(self, root, record):
        # -> int
        if root['label'] != None:      # is leaf_node
            return root['label']

        if self.comp_split_value(root['split_value'], record[root['split_attribute_index']]):
            return self._traverse_tree(root['left'], record)
        else:
            return self._traverse_tree(root['right'], record)

    def split_value(self, X, i):
        # -> Either Num Str
        '''
        Gives split value for data matrix X at attribute i
        - Continuous: returns mean
        - Discrete: returns majority class
        '''
        if isinstance(X[:, i][0], (int, float)):
            return np.mean(X[:, i])
        else:
            return np.bincount(X[:, i]).argmax()

    def comp_split_value(self, split_value, query):
        # -> bool
        '''
        Compares split value against query value for left subtree
        - Continuous: <=
        - Discrete: ==
        '''
        # FIX: Flipped split_value partitions - identify which is fixed standard
        if isinstance(split_value, (int, float)):
            return query <= split_value
        else:
            return query == split_value

    def empty_node(self):
        # -> dict
        return {
            'label': None,
            'split_attribute_index': None,
            'split_value': None,
            'left': None,
            'right': None
        }
