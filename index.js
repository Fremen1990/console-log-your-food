//Database json-server run: json-server --watch ./db.json

const axios = require("axios");

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'enter command >'
});

readline.prompt();
readline.on('line', async line => {
    switch (line.trim()) {


        case 'list vegan foods': {
            axios.get(`http://localhost:3000/food`).then(({data}) => {
                let idx = 0;
                const veganOnly = data.filter(food =>
                    food.dietary_preferences.includes('vegan'),
                );
                const veganIterable = {
                    [Symbol.iterator]() {
                        return {
                            [Symbol.iterator]() {
                                return this;
                            },
                            next() {
                                const current = veganOnly[idx];
                                idx++;
                                if (current) {
                                    return {value: current, done: false};
                                } else {
                                    return {value: current, done: true};
                                }
                            },
                        };
                    },
                };
                for (let val of veganIterable) {
                    console.log(val.name);
                }
                readline.prompt();
            });
        }
            break;


        case 'log': {
            const {data} = await axios.get(`http://localhost:3000/food`)
            const it = data[Symbol.iterator]();

            const actionIterator = {
                [Symbol.iterator]() {
                    const positions = [...this.actions];
                    return {
                        [Symbol.iterator]() {
                            return this;
                        },
                        next()
                    }
                },
                actions:[askForServingSize, displayCalories],
            }

            readline.question("What would you like to log today?  \n", async (item) => {
                let position = it.next();

                while (!position.done) {
                    const food = position.value.name;
                    if (food === item) {
                        console.log(`${item} has ${position.value.calories} calories`)
                    }
                    position = it.next();
                }
                readline.prompt();
            })
        }
    }
})


