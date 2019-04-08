## Data and Visual Analytics - Homework 4
## Georgia Institute of Technology
## Applying ML algorithms to detect eye state

import numpy as np
import pandas as pd
import time

from sklearn.model_selection import cross_val_score, GridSearchCV, cross_validate, train_test_split
from sklearn.metrics import accuracy_score, classification_report
from sklearn.svm import SVC
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler, normalize
from sklearn.decomposition import PCA

######################################### Reading and Splitting the Data ###############################################
# XXX
# TODO: Read in all the data. Replace the 'xxx' with the path to the data set.
# XXX
data = pd.read_csv('./eeg_dataset.csv')

# Separate out the x_data and y_data.
x_data = data.loc[:, data.columns != "y"]
y_data = data.loc[:, "y"]

# The random state to use while splitting the data.
random_state = 100

# XXX
# TODO: Split 70% of the data into training and 30% into test sets. Call them x_train, x_test, y_train and y_test.
# Use the train_test_split method in sklearn with the parameter 'shuffle' set to true and the 'random_state' set to 100.
# XXX
x_train, x_test, y_train, y_test = train_test_split(x_data, y_data, shuffle=True, random_state=random_state)


# ############################################### Linear Regression ###################################################
# XXX
# TODO: Create a LinearRegression classifier and train it.
# XXX
linear_regressor = LinearRegression()
start_time = time.time()
linear_regressor.fit(x_train, y_train)
print(f'Linear Regression: Fitting took {time.time() - start_time}')

# XXX
# TODO: Test its accuracy (on the training set) using the accuracy_score method.
# TODO: Test its accuracy (on the testing set) using the accuracy_score method.
# Note: Round the output values greater than or equal to 0.5 to 1 and those less than 0.5 to 0. You can use y_predict.round() or any other method.
# XXX
reg_to_binary = lambda vector: [1 if v >= 0.5 else 0 for v in vector]
# print(reg_to_binary(linear_regressor.predict(x_train) > 0.5))
acc1_train = accuracy_score(y_train, reg_to_binary(linear_regressor.predict(x_train)))
acc1_test = accuracy_score(y_test, reg_to_binary(linear_regressor.predict(x_test)))
print(f'Linear Regression: training acc = {acc1_train}. testing acc = {acc1_test}')

# ############################################### Random Forest Classifier ##############################################
# XXX
# TODO: Create a RandomForestClassifier and train it.
# XXX
rf_classifier = RandomForestClassifier()
rf_classifier.fit(x_train, y_train)

# XXX
# TODO: Test its accuracy on the training set using the accuracy_score method.
# TODO: Test its accuracy on the test set using the accuracy_score method.
# XXX
acc2_train = accuracy_score(y_train, rf_classifier.predict(x_train))
acc2_test = accuracy_score(y_test, rf_classifier.predict(x_test))
print(f'Random Forest Classifier: training acc = {acc2_train}. testing acc = {acc2_test}')

# XXX
# TODO: Determine the feature importance as evaluated by the Random Forest Classifier.
#       Sort them in the descending order and print the feature numbers. The report the most important and the least important feature.
#       Mention the features with the exact names, e.g. X11, X1, etc.
#       Hint: There is a direct function available in sklearn to achieve this. Also checkout argsort() function in Python.
# XXX
rf_feature_importances_idx = np.argsort(rf_classifier.feature_importances_)[:-1]
print(f'The most important feature: X{rf_feature_importances_idx[0]}')
print(f'The least important feature: X{rf_feature_importances_idx[-1]}')

# XXX
# TODO: Tune the hyper-parameters 'n_estimators' and 'max_depth'.
#       Print the best params, using .best_params_, and print the best score, using .best_score_.
# XXX
n_estimators_range = np.linspace(1, 50, 5, dtype=np.int16)
max_depth_range = np.linspace(1, 14, 5, dtype=np.int16)
print(f'n_estimators_range = {n_estimators_range}; max_depth_range = {max_depth_range}')

cv_rf = GridSearchCV(rf_classifier, {'n_estimators': n_estimators_range, 'max_depth': max_depth_range}, cv=10)
cv_rf.fit(x_train, y_train)
print(f'Cross-Validation on Random Forest Classifier - best score: {cv_rf.best_score_}')
print(f'Cross-Validation on Random Forest Classifier - best params: {cv_rf.best_params_}')

rf_classifier_tuned = RandomForestClassifier(**cv_rf.best_params_)
start_time = time.time()
rf_classifier_tuned.fit(x_train, y_train)
print(f'Tuned Random Forest Classifier: Fitting took {time.time() - start_time}')
acc2_train_tuned = accuracy_score(y_train, rf_classifier_tuned.predict(x_train))
acc2_test_tuned = accuracy_score(y_test, rf_classifier_tuned.predict(x_test))
print(f'Tuned Random Forest Classifier: training acc = {acc2_train_tuned}. testing acc = {acc2_test_tuned}')

# ############################################ Support Vector Machine ###################################################
# XXX
# TODO: Pre-process the data to standardize or normalize it, otherwise the grid search will take much longer
# TODO: Create a SVC classifier and train it.
# XXX
scaler = StandardScaler()
scaler.fit(x_train)
x_train_pp = scaler.transform(x_train)
x_test_pp = scaler.transform(x_test)
y_train_pp, y_test_pp = y_train, y_test

svm_classifier = SVC()
svm_classifier.fit(x_train_pp, y_train_pp)

# XXX
# TODO: Test its accuracy on the training set using the accuracy_score method.
# TODO: Test its accuracy on the test set using the accuracy_score method.
# XXX
acc3_train = accuracy_score(y_train_pp, svm_classifier.predict(x_train_pp))
acc3_test = accuracy_score(y_test_pp, svm_classifier.predict(x_test_pp))
print(f'SVM Classifier: training acc = {acc3_train}. testing acc = {acc3_test}')

# XXX
# TODO: Tune the hyper-parameters 'C' and 'kernel' (use rbf and linear).
#       Print the best params, using .best_params_, and print the best score, using .best_score_.
# XXX
cv_svm = GridSearchCV(svm_classifier, {'C': [0.01, 1.0, 100.0], 'kernel': ['rbf', 'linear']})
cv_svm.fit(x_train_pp, y_train_pp)
print(f'Cross-Validation on SVM Classifier - best score: {cv_svm.best_score_}')
print(f'Cross-Validation on SVM Classifier - best params: {cv_svm.best_params_}')
print(f'Cross-Validation results for SVM Classifier: {cv_svm.cv_results_}')

svm_classifier_tuned = SVC(**cv_svm.best_params_)
start_time = time.time()
svm_classifier_tuned.fit(x_train_pp, y_train_pp)
print(f'Tuned SVM Classifier: Fitting took {time.time() - start_time}')
acc3_train_tuned = accuracy_score(y_train_pp, svm_classifier_tuned.predict(x_train_pp))
acc3_test_tuned = accuracy_score(y_test_pp, svm_classifier_tuned.predict(x_test_pp))
print(f'Tuned SVM Classifier: training acc = {acc3_train_tuned}. testing acc = {acc3_test_tuned}')

# ######################################### Principal Component Analysis #################################################
# XXX
# TODO: Perform dimensionality reduction of the data using PCA.
#       Set parameters n_component to 10 and svd_solver to 'full'. Keep other parameters at their default value.
#       Print the following arrays:
#       - Percentage of variance explained by each of the selected components
#       - The singular values corresponding to each of the selected components.
# XXX
pca = PCA(n_components=10, svd_solver='full')
pca.fit(data)
print(f'PCA Explained Variance Ratio per component: {pca.explained_variance_ratio_}')
print(f'PCA Singular Values per component: {pca.singular_values_}')
