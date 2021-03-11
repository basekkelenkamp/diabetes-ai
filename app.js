import { DecisionTree } from "./libraries/decisiontree.js"
import { VegaTree } from "./libraries/vegatree.js"

//
// DATA
//
const csvFile = "./data/diabetes.csv"
const trainingLabel = "Label"  
const ignored = ["Age", "Insulin","Bp", "Skin"]
let amountCorrect = 0
let totalAmount = 0
let decisionTree

//
// laad csv data als json
//
function loadData() {
    Papa.parse(csvFile, {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: (results) => {
            console.log("All data: "+results.data)
            trainModel(results.data)
        }
    })
}

function calculateAccuracy(){
        //bereken de accuracy met behulp van alle test data
        let accuracy = amountCorrect / totalAmount

        console.log("Accuracy:" +accuracy)
    
        let accDiv = document.getElementById("accuracy")
        accDiv.innerHTML = `The accuracy is: ${accuracy}`
}

function showMatrix(actualDiabetes,actualNoDiabetes,predictedWrongDiabetes,predictedWrongNoDiabetes){
    document.getElementById("total").innerHTML = totalAmount+" tested in total."
    document.getElementById("total-correct").innerHTML = amountCorrect+" predicted correctly!"

    document.getElementById("actual-d").innerHTML = actualDiabetes
    document.getElementById("actual-no-d").innerHTML = actualNoDiabetes
    document.getElementById("predicted-wrong-no-d").innerHTML = predictedWrongDiabetes
    document.getElementById("predicted-wrong-d").innerHTML = predictedWrongNoDiabetes

}

function predictAll(testData){
    amountCorrect = 0
    totalAmount = testData.length

    let actualDiabetes = 0
    let actualNoDiabetes = 0
    let predictedWrongDiabetes = 0
    let predictedWrongNoDiabetes = 0


    for (const testPerson of testData) {
        let testDataNoLabel = Object.assign({}, testPerson)
        delete testDataNoLabel.Label 
        console.log(testDataNoLabel)

        let prediction = decisionTree.predict(testDataNoLabel)
        console.log(prediction)

        if(prediction == testPerson.Label) {
            amountCorrect++

            if(prediction == 0){
                actualNoDiabetes++
            }

            if(prediction == 1){
                actualDiabetes++
            }

        }

        if(prediction == 0 && testPerson.Label == 1){
            console.log("predicted no diabetes but has diabetes")
            predictedWrongNoDiabetes++
        }

        if(prediction == 1 && testPerson.Label == 0){
            console.log("predicted diabetes but has no diabetes")
            predictedWrongDiabetes++
        }

    }
    showMatrix(actualDiabetes,actualNoDiabetes,predictedWrongDiabetes,predictedWrongNoDiabetes)
}


//
// MACHINE LEARNING - Decision Tree
//
function trainModel(data) {

    //Create train & test data
    let trainData = data.slice(0, Math.floor(data.length * 0.8))
    let testData = data.slice(Math.floor(data.length * 0.8) + 1)

    console.log("train data: "+trainData)
    console.log("test data: "+testData)


    // maak het algoritme aan
    decisionTree = new DecisionTree({
        ignoredAttributes: ignored,
        trainingSet: trainData,
        categoryAttr: trainingLabel
    })

    // Teken de boomstructuur - DOM element, breedte, hoogte, decision tree
    let visual = new VegaTree('#view', 2400, 1200, decisionTree.toJSON())


    // todo : maak een prediction met een sample uit de testdata
    // Pregnant,Glucose,Bp,Skin,Insulin,bmi,Pedigree,Age
    //DELETE LABEL

    predictAll(testData)
    


    calculateAccuracy()

}


loadData()