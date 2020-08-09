
var solving = false

var sudokuGrid = [9]
var solution = [9]
for(var i = 0; i < 9; i++){
    sudokuGrid[i] = new Array(9)
}

for(var x = 0; x < 9; x++){
    for(var y = 0; y < 9; y++){
        sudokuGrid[x][y] = 0
    }
}


function initializeSudokuGrid(){
    var sudokuBox = document.getElementById("sudoku-container")
    for(var xBig = 0; xBig < 3; xBig++){
        for(var yBig = 0; yBig < 3; yBig++){
            var bigBox = document.createElement("div")
            bigBox.setAttribute("class", "bigTile")
            sudokuBox.appendChild(bigBox)
            for(x = 0; x < 3; x++){
                for(y = 0; y < 3; y++){
                    var sudokuTile = document.createElement("div")
                    var coordX = 3*xBig+x
                    var coordY = 3*yBig+y
                    var text = document.createElement("p")
                    text.innerHTML = ""
                    sudokuTile.appendChild(text)
                    sudokuTile.setAttribute("id", coordX+","+coordY)
                    sudokuTile.setAttribute("class", "tile")
                    sudokuTile.addEventListener("click", () => {
                        setNumber()})
                    bigBox.appendChild(sudokuTile)
                }
            }
        }
    }
}

function setNumber(){
    console.log(solving)
    if(!solving){
        //console.log(event.path[0].parentNode)
        var tile = event.path[0].parentNode
        var numberX = tile.id[0]
        var numberY = tile.id[2]

        //console.log(sudokuGrid[numberX][numberY])
        if(sudokuGrid[numberX][numberY]==0){
            sudokuGrid[numberX][numberY]=1
        }else{
            sudokuGrid[numberX][numberY] += 1
            sudokuGrid[numberX][numberY] %= 10
        }
        var text = tile.childNodes[0]
        if(sudokuGrid[numberX][numberY]==0){
            
            text.innerHTML = ""
        }
        else{   
            text.innerHTML = sudokuGrid[numberX][numberY]
        }
    }
}


var solutionX = 0
var solutionY = 0
var solverTimer

function solve(){
    document.getElementById("solveButton").setAttribute("class", "hidden")
    document.getElementById("stopButton").setAttribute("class", "")
    document.getElementById("resetButton").setAttribute("class", "")
    solving = true
    console.log("Solving...")
    for(var i=0; i<9; i++){
        solution[i] = [...sudokuGrid[i]]
    }
    solutionX = 0
    solutionY = 0
    //More intuitive speed setting for slider
    var speed = Math.floor(487-document.getElementById("speedSlider").value+0.0189*document.getElementById("speedSlider").value^2)
    solverTimer = setInterval(solver, speed)
}


function solver(){
    //Make a guess
    solution[solutionX][solutionY]++
    visualizeSolving(solutionX, solutionY)
    //If valid guess, go to next empty tile
    if(valid()){
        if(solutionX>=8 && solutionY>=8){
            console.log("Solved!")
            clearInterval(solverTimer)
            return
        }
        solutionY++
        if(solutionY==9){
            solutionX++
            solutionY=0
        }
        visualizeSolving(solutionX, solutionY)
        while(sudokuGrid[solutionX][solutionY]!=0){
            if(solutionX>=8 && solutionY>=8){
                console.log("Solved!")
                clearInterval(solverTimer)
                return
            }
            solutionY++
            if(solutionY==9){
                solutionX++
                solutionY=0
            }
            visualizeSolving(solutionX, solutionY)
        }
    }
    //If not valid and no more numbers, backtrack until a valid guess can be made
    else if(solution[solutionX][solutionY]==9){
        solution[solutionX][solutionY]=0
        solutionY--
        if(solutionY<0){
            solutionY=8
            solutionX--
        }
        visualizeSolving(solutionX, solutionY)
        while(sudokuGrid[solutionX][solutionY]!=0 || solution[solutionX][solutionY]==9){
            if(sudokuGrid[solutionX][solutionY]==0){
                solution[solutionX][solutionY]=0
            }
            solutionY--
            if(solutionY<0){
                solutionY=8
                solutionX--
            }
            visualizeSolving(solutionX, solutionY)
        }
    }
}
var tile = null
function visualizeSolving(x, y){
    if(tile != null){
        tile.setAttribute("class", "tile")
        if(solution[tile.id[0]][tile.id[2]]!=0){
            tile.childNodes[0].innerHTML = solution[tile.id[0]][tile.id[2]]
        }
        else{
            tile.childNodes[0].innerHTML = ""
        }
    }
    tile = document.getElementById(x+","+y)
    tile.setAttribute("class", "tile selected")
    if(solution[tile.id[0]][tile.id[2]]!=0){
        tile.childNodes[0].innerHTML = solution[tile.id[0]][tile.id[2]]
    }
    else{
        tile.childNodes[0].innerHTML = ""
    }
    
}



function valid(){
    var counter


    //Check rows
    for(var x = 0; x<9; x++){
        counter =  Array(10).fill(false)
        for(var y=0; y<9; y++){
            var num = solution[x][y]
            if(num!=0 && counter[num]){
                return false
            }
            counter[num] = true
        }
    }
    //Check columns
    for(var y = 0; y<9; y++){
        counter =  Array(10).fill(false)
        for(var x=0; x<9; x++){
            var num = solution[x][y]
            if(num!=0 && counter[num]){
                return false
            }
            counter[num] = true
        }
    }
    //Check small squares
    for(var xBig = 0; xBig < 3; xBig++){
        for(var yBig = 0; yBig < 3; yBig++){
            counter =  Array(10).fill(false)
            for(x = 0; x < 3; x++){
                for(y = 0; y < 3; y++){
                    var coordX = 3*xBig+x
                    var coordY = 3*yBig+y
                    var num = solution[coordX][coordY]
                    if(num!=0 && counter[num]){
                        return false
                    }
                    counter[num] = true
                }
            }
        }
    }
    return true
}

function reset(){
    
    console.log("Board reset")
    stop()
    var sudokuGrid = [9]
    var solution = [9]
    for(var i = 0; i < 9; i++){
        sudokuGrid[i] = new Array(9)
    }

    for(var x = 0; x < 9; x++){
        for(var y = 0; y < 9; y++){
            sudokuGrid[x][y] = 0
            
            var tile = document.getElementById(x+","+y)
            tile.setAttribute("class", "tile")
            tile.childNodes[0].innerHTML = ""
        }
    }
}

function stop(){
    document.getElementById("solveButton").setAttribute("class", "")
    document.getElementById("stopButton").setAttribute("class", "hidden")
    document.getElementById("resetButton").setAttribute("class", "hidden")
    if(solverTimer!=null){
        clearInterval(solverTimer)
        console.log("Solving stopped")
    }
    solving = false
}