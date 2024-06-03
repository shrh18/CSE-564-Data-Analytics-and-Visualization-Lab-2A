# CSE-564-Data-Analytics-and-Visualization-Lab-2A: Data Visualization and Dimension Reduction
A D3.js Dashboard utilizing Data Engineering, Feature Extraction, Data Reduction using Principal Components Analysis and Pearson's Co-relation visualized through ScreePlots and PCA Loadings, Used KMeans Clustering and Elbow Point Method to find the Optimums

## Setup
- **Client-Server System**: 
  - Python for processing (server)
  - D3 for visualization (client)

## Tasks Overview

### Task 1: Dimension Reduction with PCA
- **Compute PCA**: Obtain Eigenvectors and Eigenvalues
- **Scree Plot**: Visualize Eigenvalues and add interaction to select intrinsic dimensionality index (di)
- **Biplot**: Plot data using PCA-based biplot

### Task 2: Scatterplot Matrix
- **Select Attributes**: Use PCA components ≤di to find 4 attributes with the highest squared sum of PCA loadings
- **Construct Matrix**: Create a scatterplot matrix with these attributes

### Task 3: K-Means Clustering
- **Elbow Method**: Determine best k and visualize the function on k
- **Cluster Points**: Color points by cluster ID

## Initial Displays
- **Scree Plot**: Bar chart for PCA scree plot with intrinsic dimensionality selection
- **K-Means MSE Plot**: Bar chart for k-means MSE with initial k selection
- **Biplot**: Color points by initial k
- **Scatterplot Matrix**: Attributes chosen by initial intrinsic dimensionality, coloured by initial k

## User Interactions
- **Intrinsic Dimensionality**: Select different intrinsic dimensionality in the scree plot
- **K Selection**: Select different k in the k-means MSE plot
- **PCA Vectors**: Observe the effects of choosing different PCA vectors as projection basis

## Observations and Additional Insights
- **Biplot Adjustments**: Explore the impact of different PCA vectors on display quality
