export const loadingAnimationHTML = `
<html>
<head>
<style>
  .loader {
    border: 16px solid #f3f3f3;
    border-radius: 50%;
    border-top: 16px solid #3498db;
    width: 120px;
    height: 120px;
    -webkit-animation: spin 2s linear infinite; /* Safari */
    animation: spin 2s linear infinite;
    position: fixed; /* or absolute */
    top: 50%;
    left: 50%;
    margin-top: -60px;
    margin-left: -60px;
  }

  /* Safari */
  @-webkit-keyframes spin {
    0% { -webkit-transform: rotate(0deg); }
    100% { -webkit-transform: rotate(360deg); }
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style>
</head>
<body>
  <div class="loader"></div>
</body>
</html>
`;

export const loadingErrorHTML = `
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  .error {
    color: red;
    font-size: x-large;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
</head>
<body>
  <div class="error">Error loading pdf statement</div>
</body>
</html>
`;


