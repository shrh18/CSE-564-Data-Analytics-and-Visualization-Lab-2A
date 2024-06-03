from flask import Flask, render_template, request, jsonify
import json
import numpy as np
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.metrics import mean_squared_error
from sklearn.feature_selection import VarianceThreshold
import csv
import pandas
from kneed import KneeLocator

import dataFeaturing
import math



global csv_file_path, modified_data, X_standardized, pca, X_pca, eigenvalues, kn, X
csv_file_path = 'static\Rounded_Goals_Scored_Final Dataset.csv'


app = Flask(__name__)
app.run(debug=True)

@app.route("/")
def home_page():
    return render_template('home.html')


@app.post('/plotGraph')
def plotGraph():
    data = request.json
    # data = json.loads(data)
    print(data)
    plotData = dataFeaturing.data_extraction(data['selectedLeague'], data['selectedVariable'], data['graphType'], data['xAxisVariable'], data['yAxisVariable'])      
    return jsonify(plotData)


@app.post("/pca")
def performPCA():
    data = pandas.read_csv(csv_file_path, index_col='Rk')
    columns_to_remove = ['Player', 'Nation', 'Pos', 'Squad', 'Comp', 'Born', 'PasTotAtt', 'TouLive']
    columns_to_keep = ['MP', 'GoalsScored', 'Starts', 'Min', '90s', 'TotalSuccessPasses', 'Touches', 'TotalAssists', 'Carries', 'CarTotDist', 'Rec%', 'FoulsCommitted']
    

    # Method 1: Using drop()
    global modified_data
    modified_data = data.drop(columns_to_remove, axis=1, inplace=False)

    # Method 2: New data
    # modified_data = data[columns_to_keep]


    # Remove highly correlated columns
    corr_matrix = modified_data.corr().abs()
    upper_triangle = corr_matrix.where(np.triu(np.ones(corr_matrix.shape), k=1).astype(np.bool_))
    to_drop = [column for column in upper_triangle.columns if any(upper_triangle[column] > 0.65)]  # Adjust the threshold as needed
    modified_data = modified_data.drop(columns=to_drop)
    
    global X
    X = modified_data.values
    # print("X - ", X)
    data = request.json
    # print("data - ", data)
    num_components = int(data['num_components'])

    # Apply corelation
    global X_standardized
    X_standardized = StandardScaler().fit_transform(X)
    # Perform PCA
    global pca
    pca = PCA(n_components=num_components)
    global X_pca
    X_pca = pca.fit_transform(X_standardized)

    # Get Eigenvalues for the scree plot
    global eigenvalues
    eigenvalues = pca.explained_variance_
    global kn
    kn = KneeLocator(range(0, num_components), eigenvalues, curve='convex', direction='decreasing', interp_method='interp1d')
    print("Knee point - ", kn.knee)

    # print(eigenvalues.tolist())
    # print(pca.explained_variance_ratio_.tolist())
    # print(X_pca.tolist())
    # print([f'Feature {i+1}' for i in range(X.shape[1])])

    kMeansMSE = []  # List to store mean squared errors for each k

    for k in range(1, 11):
        kmeans = KMeans(n_clusters=k)
        kmeans.fit(X_pca.tolist())
        labels = kmeans.labels_

        # Calculate the mean squared error
        mse = mean_squared_error(X_pca.tolist(), kmeans.cluster_centers_[labels])
        kMeansMSE.append(mse)



    return jsonify({
        'eigenvalues': eigenvalues.tolist(),
        'explained_variance_ratio': pca.explained_variance_ratio_.tolist(),
        'principal_components': X_pca.tolist(),
        'feature_names': [f'Feature {i+1}' for i in range(X.shape[1])],
        'knee': int(kn.knee) if kn else None,
        'kMeansMSE': kMeansMSE
    })


@app.post("/biplot")
def plotBiplot():
    data = request.json
    idi = int(data["IDIval"])
    knee = int(data["knee"]) + 1
    kVal = int(data["kMean"])
    print("Knee is - ", knee)
    print("IDI val - ", idi)
    # print("FeaureNames - ", modified_data.columns.tolist())   

    # Get loadings for biplot
    
    loadings = pca.components_.T * np.sqrt(pca.explained_variance_)

    sumofSqLoadings = []
    for loading in loadings:    
        sumOfSq = 0
        for i in range(idi):
            sumOfSq += loading[i]**2
        sumofSqLoadings.append(math.sqrt(sumOfSq))

    # print("sq loadings - ", sumofSqLoadings)
    # print("sq loadings - ", sorted(sumofSqLoadings, reverse=True))
    top_4_values = sorted(sumofSqLoadings, reverse=True)[:4]
    print("top 4 - ", top_4_values)
    top_4_features = []
    for val in top_4_values:
        top_4_features.append(modified_data.columns.tolist()[sumofSqLoadings.index(val)])
    
    print("Top 4 features are - ", top_4_features)

    dataForTop4 = []
    for hh in range(len(X_standardized)):
        row = []
        for feature in top_4_features:
            row.append(X_standardized[hh][modified_data.columns.tolist().index(feature)])
        dataForTop4.append(row)

    print("data for top 4 - ", dataForTop4[0])

    components = []
   
    for feature in top_4_features:
        pcaComps = []
        pcaComps.append(pca.components_[0][modified_data.columns.tolist().index(feature)])
        pcaComps.append(pca.components_[1][modified_data.columns.tolist().index(feature)])
        components.append(pcaComps)

    print("New components - ", components)
    kmeans = KMeans(n_clusters=kVal)
    kmeans.fit(X_pca.tolist())
    print("kmeans labels - ", kmeans.labels_)
    # print("Loadings - ", loadings)

    top4Data = []
    for row in X_standardized:
        data = []
        for feature in top_4_features:
            data.append(row[modified_data.columns.tolist().index(feature)])
        top4Data.append(data)

    
    return jsonify({
        "data": dataForTop4,
        "scores": X_pca.tolist(),
        "loadings": loadings.tolist(),
        "components": components,
        "eigenvalues": eigenvalues.tolist(),
        "explained_variance_ratio": pca.explained_variance_ratio_.tolist(),
        "IDIval": idi,
        "featureNames": top_4_features,
        "AllFeatures": modified_data.columns.tolist(),
        "knee": knee,
        "labels": kmeans.labels_.tolist(),
        "top4Data": top4Data, 
        "sumofSqLoadings": sumofSqLoadings
    })

    
