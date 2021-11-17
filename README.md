# dev-challenge-2021
Backend task for devchallenge.it in 2021

This is the service for composing the list of the commands for CNC.

## Task

Your customer makes cardboard boxes from sheets of cardboard to pack different things there. You need to make a WebAPI service that will help him cut from the whole sheet - he will set the size of the sheet and the size of the desired box, and your service will give him a CNC program that will cut the maximum number of boxes with a minimum amount of waste.

## How to run the service

To start the service in the Docker:
```
docker-compose up
```

To start the service locally:
```
npm ci
npm run dev
```

### Tests

In the Docker:
```
docker-compose -f docker-compose.test.yml up
```

Locally:
```
npm test
```

## Description

The first logic that has been implemented in `CNC.cutV1` was with the simple thought in mind that nesting pattern of the one box has at most the size of its biggest sizes.
So the single form can be just located one by one.

After determining the location it can be easily transferred to the commands.

The next step for the algorithm is backtracking algorithm implemented in the `CNC.cutV2` method.
It tries to fit the box in the specified place. If it fits, calculate the further number of box that can be cutted.
This number can be compared when we try to move this box a bit.

The one more advantage for this approach is that it is scalable for the number of the possible forms we can accept, the list can be extended later.

Since this algorithm may be consuming I suggest the way optimization in the step of the backtracking algorithm - the minimum size of the sides of the box.

The further improvement may include:
- more tests
- additional forms
- optimization of algorithm's loops

## API

```
POST /api/simple_box
```

Body:
```
{
    "sheetSize": {
        "w": 1500,
        "l": 1000
    },
    "boxSize": {
        "w": 200,
        "d": 200,
        "h": 200
    }
}
```

Response example:
```
{
    "success": true,
    "amount": 1,
    "program": [
        {
            "command": "START"
        },
        {
            "command": "GOTO",
            "x": 0,
            "y": 200
        },
        {
            "command": "DOWN"
        },
        {
            "command": "GOTO",
            "x": 200,
            "y": 200
        },
        {
            "command": "GOTO",
            "x": 200,
            "y": 0
        },
        {
            "command": "GOTO",
            "x": 400,
            "y": 0
        },
        {
            "command": "GOTO",
            "x": 400,
            "y": 200
        },
        {
            "command": "GOTO",
            "x": 800,
            "y": 200
        },
        {
            "command": "GOTO",
            "x": 800,
            "y": 400
        },
        {
            "command": "GOTO",
            "x": 400,
            "y": 400
        },
        {
            "command": "GOTO",
            "x": 400,
            "y": 600
        },
        {
            "command": "GOTO",
            "x": 200,
            "y": 600
        },
        {
            "command": "GOTO",
            "x": 200,
            "y": 400
        },
        {
            "command": "GOTO",
            "x": 0,
            "y": 400
        },
        {
            "command": "GOTO",
            "x": 0,
            "y": 200
        },
        {
            "command": "UP"
        },
        {
            "command": "STOP"
        }
    ]
}
```
