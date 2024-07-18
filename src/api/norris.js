class NorrisApi {
    async getNorrisJokes(quantity = 1) {
        const jokes = [];
        try {
            for (let i = 0; i <= quantity; i++) {
                const res = await fetch('https://api.chucknorris.io/jokes/random');
                if (res.ok) {
                    const joke = await res.json();
                    jokes.push(joke.value);
                }

            }
        } catch (e) {
            console.error(e)
        }


        return jokes;
    }
}

export default new NorrisApi()