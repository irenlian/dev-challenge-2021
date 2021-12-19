# dev-challenge-2021
Backend task for devchallenge.it in 2021

This is the service for composing the list of the commands for CNC.

The next round of the challenge please see here: https://github.com/irenlian/dev-challenge-2021-final

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

During development there were implemented 4 algorithms.

#### V1
The first logic that has been implemented in `CNC.cutV1` was with the simple thought in mind that nesting pattern of the one box has at most the size of its biggest sizes.
So the single form can be just located one by one.

After determining the location it could be easily transferred to the commands.

#### V2

Since the boxes weren't close enough in the previous algorithm, I decided to iterate overall rotation combinations in each possible location.

V2 is backtracking algorithm that was improved by memoization.
It tries to fit the box in the specified place. If it fits, calculate the further number of box that can be cutted.
This number can be compared when we try to move this box a bit.

The one more advantage for this approach is that it is scalable for the number of the possible forms we can accept, the list can be extended later.

#### V3

The previous algorithm turned out to be really consuming and despite the stop point using time it may occur off the timeout period.

V3 used all 4 rotations but tried to find only one possible place for the new box.

And also it uses iterative approach which allows us to stop in time.

In V3 and V2 was used the logic of determining if the current box conflits with previous located box. And since each form is a list of coordinates and each box can be divided on rectangles, so the algorithm checks if the rectangles from two boxes are intersected.

#### V4 

The previous solution is still under perform for the large sheet size.

So to balance precision and performance, we could use the first approach and just stick the boxes together in one direction.

In order to count two possible orientations of the sheet, we have two orientations of boxes rows.

### Conclusion

V3 has the best precision in a reasonable time and can be used for cases when we have more than 10 seconds or for small sheets.

The advantage of V3 is that it may be extended with different unique forms.

V4 has been selected since we are expecting high load.

There is also a test where these 4 algorithms are compared by the resulting boxes and time consumed.
In order to run this test you need to remove `.skip` for `Effectiveness comparison` suite  and adjust `TESTS_NUMBER` before running tests.

### Further improvements

The further improvement may include:
- more tests
- additional forms
- optimization of V3 algorithm's step to the greatest common divisor

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
    "amount": 3,
    "program": [
        {
            "command": "START"
        },
        {
            "command": "GOTO",
            "x": 200,
            "y": 600
        },
        {
            "command": "DOWN"
        },
        {
            "command": "GOTO",
            "x": 200,
            "y": 800
        },
        {
            "command": "GOTO",
            "x": 400,
            "y": 800
        },
        {
            "command": "GOTO",
            "x": 400,
            "y": 600
        },
        {
            "command": "GOTO",
            "x": 600,
            "y": 600
        },
        {
            "command": "GOTO",
            "x": 600,
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
            "y": 0
        },
        {
            "command": "UP"
        },
        {
            "command": "GOTO",
            "x": 200,
            "y": 0
        },
        {
            "command": "DOWN"
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
            "command": "UP"
        },
        {
            "command": "GOTO",
            "x": 0,
            "y": 600
        },
        {
            "command": "DOWN"
        },
        {
            "command": "GOTO",
            "x": 200,
            "y": 600
        },
        {
            "command": "UP"
        },
        {
            "command": "GOTO",
            "x": 800,
            "y": 200
        },
        {
            "command": "DOWN"
        },
        {
            "command": "GOTO",
            "x": 800,
            "y": 0
        },
        {
            "command": "UP"
        },
        {
            "command": "GOTO",
            "x": 600,
            "y": 0
        },
        {
            "command": "DOWN"
        },
        {
            "command": "GOTO",
            "x": 600,
            "y": 200
        },
        {
            "command": "GOTO",
            "x": 400,
            "y": 200
        },
        {
            "command": "GOTO",
            "x": 400,
            "y": 400
        },
        {
            "command": "GOTO",
            "x": 600,
            "y": 400
        },
        {
            "command": "GOTO",
            "x": 600,
            "y": 800
        },
        {
            "command": "GOTO",
            "x": 800,
            "y": 800
        },
        {
            "command": "GOTO",
            "x": 800,
            "y": 400
        },
        {
            "command": "GOTO",
            "x": 1000,
            "y": 400
        },
        {
            "command": "GOTO",
            "x": 1000,
            "y": 200
        },
        {
            "command": "GOTO",
            "x": 800,
            "y": 200
        },
        {
            "command": "UP"
        },
        {
            "command": "GOTO",
            "x": 1000,
            "y": 600
        },
        {
            "command": "DOWN"
        },
        {
            "command": "GOTO",
            "x": 1000,
            "y": 800
        },
        {
            "command": "GOTO",
            "x": 1200,
            "y": 800
        },
        {
            "command": "GOTO",
            "x": 1200,
            "y": 600
        },
        {
            "command": "GOTO",
            "x": 1400,
            "y": 600
        },
        {
            "command": "GOTO",
            "x": 1400,
            "y": 400
        },
        {
            "command": "GOTO",
            "x": 1200,
            "y": 400
        },
        {
            "command": "GOTO",
            "x": 1200,
            "y": 0
        },
        {
            "command": "UP"
        },
        {
            "command": "GOTO",
            "x": 1000,
            "y": 0
        },
        {
            "command": "DOWN"
        },
        {
            "command": "GOTO",
            "x": 1000,
            "y": 400
        },
        {
            "command": "GOTO",
            "x": 800,
            "y": 400
        },
        {
            "command": "GOTO",
            "x": 800,
            "y": 600
        },
        {
            "command": "GOTO",
            "x": 1000,
            "y": 600
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
