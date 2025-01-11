export const calculateStandardDeviation = (documents)=> {
    const n = documents.length;
    

    // mean finder
    let totalSum=0;
    for(let i=0; i<n; i++){
        totalSum += documents[i].price;
    }
    const mean = totalSum / n;
    console.log("mean: ", mean);


    // squared differences
    totalSum = 0;
    for(let i=0; i<n; i++){
        totalSum += (documents[i].price - mean) ** 2;
        console.log(documents[i].price,"     ",mean,"      ",totalSum);
    }
    const squaredDiff = totalSum / n;
    console.log("Squared Difference : ", squaredDiff);

    // const variance = squaredDifferences.reduce((sum, diff) => sum + diff, 0) / n;

    // const stdDev = Math.sqrt(variance);

    return squaredDiff;
}