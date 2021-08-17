const board = [
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null]
];

const dice = [
    [[1, 3], [2, 2], [2, 3], [3, 2], [3, 3], [4, 2]],
    [[4, 4], [4, 5], [3, 4], [4, 3], [5, 3], [5, 4]],
    [[0, 4], [5, 1], [0, 4], [5, 2], [1, 5], [4, 0]],
    [[0, 0], [2, 0], [3, 0], [3, 1], [4, 1], [5, 2]],
    [[5, 0], [0, 5], [5, 0], [0, 5], [0, 5], [5, 0]],
    [[0, 3], [1, 4], [2, 4], [2, 5], [3, 5], [5, 5]],
    [[0, 2], [1, 0], [1, 1], [0, 1], [1, 2], [2, 1]]
];

let shapes = [
    {
        coords: [
            [1]
        ],
        color: "blue",
        highlighted: false,
        onBoard: false
    },
    {
        coords:
            [
                [1, 0],
                [1, 0]
            ]
        ,
        color: "brown",
        highlighted: false,
        onBoard: false
    },
    {
        coords:
            [
                [1, 0, 0],
                [1, 0, 0],
                [1, 0, 0]
            ]
        ,
        color: "orange",
        highlighted: false,
        onBoard: false
    },
    {
        coords: [
            [1, 1],
            [1, 1]
        ],
        color: "green",
        highlighted: false,
        onBoard: false
    },
    {
        coords: [
            [1, 1],
            [1, 0]
        ],
        color: "purple",
        highlighted: false,
        onBoard: false
    },
    {
        coords: [
            [1, 0, 0],
            [1, 1, 0],
            [0, 1, 0]
        ],
        color: "red",
        highlighted: false,
        onBoard: false
    },
    {
        coords: [
            [1, 1, 0],
            [1, 0, 0],
            [1, 0, 0]
        ],
        color: "cyan",
        highlighted: false,
        onBoard: false
    },
    {
        coords: [
            [1, 1, 1],
            [0, 1, 0],
            [0, 0, 0]
        ],
        color: "yellow",
        highlighted: false,
        onBoard: false
    },
    {
        coords: [
            [1, 0, 0, 0],
            [1, 0, 0, 0],
            [1, 0, 0, 0],
            [1, 0, 0, 0]
        ],
        color: "grey",
        highlighted: false,
        onBoard: false
    },
];


const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const blockSize = 50;
const blockedSquares = rollDice();
let selectedShape;


reDrawGame()

document.addEventListener("keydown", (e) => {
    if (e.key !== "r") {
        return;
    }
    console.log(shapes)
    const shapeSelected = shapes.find(shape => shape.highlighted);
    if (!shapeSelected) {
        return;
    }
    console.log(shapeSelected)
    console.log("rotate!")
    console.log(shapeSelected.coords);
    const newCoords = rotateClockwise(shapeSelected.coords);
    shapeSelected.coords = newCoords;
    reDrawGame()
});

function removeSelectedPreview() {
    board.forEach((row, i) => {
        row.forEach((square, j) => {
            if (square === selectedShape.color) {
                board[i][j] = null;
            }
        })
    })
}

canvas.addEventListener("mousemove", (e) => {
    if (!selectedShape) {
        return;
    }
    console.log("e", e);
    console.log(selectedShape)
    const x = Math.floor(e.clientX / blockSize) * blockSize;
    const y = Math.floor(e.clientY / blockSize) * blockSize;
    const hoverOverBoard = Math.floor(e.clientX / blockSize) < 6 && Math.floor(e.clientY / blockSize) < 6;
    if (hoverOverBoard && selectedShape) {
        removeSelectedPreview()
        let boardSquare = board[Math.floor(e.clientY / blockSize)][Math.floor(e.clientX / blockSize)];
        if (boardSquare !== null) {
            removeSelectedPreview()
            console.log("already blocked!", board)
            reDrawGame()
            return;
        }
        board[Math.floor(e.clientY / blockSize)][Math.floor(e.clientX / blockSize)] = selectedShape.color;
        reDrawGame()
    } else {
        removeSelectedPreview()
        reDrawGame()
    }
});

function reDrawGame() {
    ctx.clearRect(0, 0, 1000, 1000);
    drawBoard();
    drawBlockers();
    drawShapes();
}

canvas.addEventListener("mousedown", (e) => {
    console.log("click!", e);
    const x = Math.floor(e.clientX / blockSize) * blockSize;
    const y = Math.floor(e.clientY / blockSize) * blockSize;
    shapes = shapes.map(shape => {
        return {
            ...shape,
            highlighted: false
        }
    })
    const shapeFound = shapes.find(shape => {
        const inRangeX = x >= shape.x && x <= shape.x + (shape.coords.length - 1) * blockSize;
        const inRangeY = y >= shape.y && y <= shape.y + (shape.coords.length - 1) * blockSize;
        return inRangeX && inRangeY && !shape.onBoard;
    });
    if (shapeFound) {
        shapeFound.highlighted = true;
        selectedShape = shapeFound
    }
    console.log("selectedShape: ", selectedShape)
    if (Math.floor(e.clientX / blockSize) < 6 && Math.floor(e.clientY / blockSize) < 6 && selectedShape) {
        let boardSquare = board[Math.floor(e.clientY / blockSize)][Math.floor(e.clientX / blockSize)];
        if (boardSquare === 0) {
            console.log("already blocked!")
            return;
        }
        console.log("add to board!")
        // need to figure out how to draw more than a square
        board[Math.floor(e.clientY / blockSize)][Math.floor(e.clientX / blockSize)] = selectedShape.color;
        selectedShape.onBoard = true;
        shapes = shapes.map(shape => {
            if (selectedShape.color === shape.color) {
                return {
                    ...shape,
                    onBoard: true
                }
            } else {
                return shape;
            }
        })
        console.table(board);
        selectedShape = null;

    }

    console.table(shapes)
    ctx.clearRect(0, 0, 1000, 1000);
    drawBoard();
    drawBlockers();
    drawShapes();
})

function drawBoard() {
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 6; j++) {
            drawBlockOutline(i * blockSize, j * blockSize, blockSize, "black")
            if (board[i][j] !== null && board[i][j] !== 0) {
                drawBlock(j * blockSize, i * blockSize, board[i][j]) 
            }
        }
    }
}

function drawBlockers() {
    blockedSquares.forEach(shape => {
        const [x, y] = shape;
        board[y][x] = 0;
        drawBlock(x * blockSize, y * blockSize, shape.color || "black");
    });
}

console.log(board)

function drawShapes() {
    let x = 7 * blockSize;
    let y = 0;
    shapes.forEach(shape => {
        if (shape.highlighted) {
            drawBlockOutline(x, y * blockSize, blockSize * shape.coords.length, "red");
        }
        if (!shape.onBoard) {
            shape.coords.forEach((row, rowI) => {
                row.forEach((el, i) => {
                    if (el === 1) {
                        drawBlock(i * blockSize + x, blockSize * y, shape.color);
                    }
                    if (i === 0 && rowI === 0) {
                        shape.x = i * blockSize + x;
                        shape.y = blockSize * y
                    }
                });
                y++;
            });
            y++
        }
        if (y > 9) {
            y = 0;
            x += 3 * blockSize;
        }
    });
}

function rollDice() {
    const blockedSquares = [];
    dice.forEach(die => blockedSquares.push(die[Math.floor(Math.random() * die.length)]));
    return blockedSquares;
}

function drawBlock(x, y, color) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.fillRect(x, y, blockSize, blockSize);
    ctx.closePath();
}

function drawBlockOutline(x, y, size, color) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.strokeRect(x, y, size, size);
    ctx.closePath();
}

function rotateClockwise(a) {
    var n=a.length;
    for (var i=0; i<n/2; i++) {
        for (var j=i; j<n-i-1; j++) {
            var tmp=a[i][j];
            a[i][j]=a[n-j-1][i];
            a[n-j-1][i]=a[n-i-1][n-j-1];
            a[n-i-1][n-j-1]=a[j][n-i-1];
            a[j][n-i-1]=tmp;
        }
    }
    return a;
}

