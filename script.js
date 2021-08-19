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
        onBoard: false,
        numSquares: 1
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
        onBoard: false,
        numSquares: 2
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
        onBoard: false,
        numSquares: 3
    },
    {
        coords: [
            [1, 1],
            [1, 1]
        ],
        color: "green",
        highlighted: false,
        onBoard: false,
        numSquares: 4
    },
    {
        coords: [
            [1, 1],
            [1, 0]
        ],
        color: "purple",
        highlighted: false,
        onBoard: false,
        numSquares: 3

    },
    {
        coords: [
            [1, 0, 0],
            [1, 1, 0],
            [0, 1, 0]
        ],
        color: "red",
        highlighted: false,
        onBoard: false,
        numSquares: 4
    },
    {
        coords: [
            [1, 1, 0],
            [1, 0, 0],
            [1, 0, 0]
        ],
        color: "cyan",
        highlighted: false,
        onBoard: false,
        numSquares: 4
    },
    {
        coords: [
            [1, 1, 1],
            [0, 1, 0],
            [0, 0, 0]
        ],
        color: "yellow",
        highlighted: false,
        onBoard: false,
        numSquares: 4
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
        onBoard: false,
        numSquares: 4
    },
];


const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const blockSize = 35;
const blockedSquares = rollDice();
let selectedShape, lastX, lastY;


drawGame();

document.addEventListener("keydown", (e) => {
    if (e.key !== "r") {
        return;
    }
    const shapeSelected = shapes.find(shape => shape.highlighted);
    if (!shapeSelected) {
        return;
    }
    const newCoords = rotateClockwise(shapeSelected.coords);
    shapeSelected.coords = newCoords;
    removeSelectedPreview();
    createPreview(lastX, lastY);
    drawGame()
});


canvas.addEventListener("mousemove", (e) => {
    if (!selectedShape) {
        return;
    }
    const x = Math.floor(e.offsetX / blockSize) * blockSize;
    const y = Math.floor(e.offsetY / blockSize) * blockSize;
    if (lastX === x && lastY === y) {
        return;
    }
    lastX = x;
    lastY = y;
    const hoverOverBoard = Math.floor(e.offsetX / blockSize) < 6 && Math.floor(e.offsetY / blockSize) < 6;
    if (hoverOverBoard && selectedShape) {
        removeSelectedPreview();
        createPreview(x, y);
        drawGame();
    } else {
        removeSelectedPreview();
        drawGame();
    }
});

canvas.addEventListener("mousedown", (e) => {
    console.log("mousedown!", e);
    const x = Math.floor(e.offsetX / blockSize) * blockSize;
    const y = Math.floor(e.offsetY / blockSize) * blockSize;
    shapes = shapes.map(shape => {
        return {
            ...shape,
            highlighted: false
        }
    })
    const shapeFound = findShape(x, y);
    if (shapeFound) {
        shapeFound.highlighted = true;
        selectedShape = shapeFound
    }
    const onBoard = Math.floor(e.offsetX / blockSize) < 6 && Math.floor(e.offsetY / blockSize) < 6
    if (onBoard) {
        let boardSquare = board[Math.floor(e.offsetY / blockSize)][Math.floor(e.offsetX / blockSize)];
        if (!selectedShape && boardSquare !== null && boardSquare !== 0) {
            removeShapeFromBoard(boardSquare)
        }
     
        if (selectedShape) {
            const previewOnBoard = board.slice().flat().includes(selectedShape.color);
            if (!previewOnBoard) {
                return;
            }
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
    }
    drawGame()
});

function removeShapeFromBoard(boardSquare) {
    shapes = shapes.map(shape => {
        if (shape.color === boardSquare) {
            return {
                ...shape,
                onBoard: false
            }
        } else {
            return shape
        }
    })
    board.forEach((row, i) => {
        row.forEach((square, j) => {
            if (square === boardSquare) {
                board[i][j] = null;
            }
        })
    })
}

function drawGame() {
    ctx.clearRect(0, 0, 1000, 1000);
    drawBoard();
    drawShapes();
    drawBlockers();
}

function removeSelectedPreview() {
    board.forEach((row, i) => {
        row.forEach((square, j) => {
            if (square === selectedShape.color) {
                board[i][j] = null;
            }
        })
    })
}

function createPreview(x, y) {
    let cancelDraw;
    let squaresToDraw = [];
    let shapeCoordI = 0;
    const sizeOfShape = selectedShape.coords.length;
    board.forEach((row, i) => {
        if (i >= y / blockSize && i < y / blockSize + sizeOfShape) {
            let shapeCoordJ = 0;
            for (let j = x / blockSize; j < x / blockSize + sizeOfShape; j++) {
                if (sizeOfShape === 1 && board[i][j] === null) {
                    board[i][j] = selectedShape.color;
                    break;
                }
                if (selectedShape.coords[shapeCoordI][shapeCoordJ] === 1) {
                    if (board[i][j] !== null) {
                        cancelDraw = true;
                    }
                    squaresToDraw.push([i, j])
                }
                shapeCoordJ++
            }
            shapeCoordI++
        }
    })
    if (!cancelDraw && selectedShape.numSquares === squaresToDraw.length) {
        squaresToDraw.forEach((coord) => {
            board[coord[0]][coord[1]] = selectedShape.color
        });
    }
    console.table(board)
    cancelDraw = false;
}

function findShape(x, y) {
    return shapes.find(shape => {
        const inRangeX = x >= shape.x && x <= shape.x + (shape.coords.length - 1) * blockSize;
        const inRangeY = y >= shape.y && y <= shape.y + (shape.coords.length - 1) * blockSize;
        return inRangeX && inRangeY && !shape.onBoard;
    });
}

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
    var n = a.length;
    for (var i = 0; i < n / 2; i++) {
        for (var j = i; j < n - i - 1; j++) {
            var tmp = a[i][j];
            a[i][j] = a[n - j - 1][i];
            a[n - j - 1][i] = a[n - i - 1][n - j - 1];
            a[n - i - 1][n - j - 1] = a[j][n - i - 1];
            a[j][n - i - 1] = tmp;
        }
    }
    return a;
}

