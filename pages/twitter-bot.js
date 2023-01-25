import axios from 'axios'

const TwitterBot = () => {

    const handleSubmit = async () => {
        try {
            const resp = await axios.post(`/api/twitter`)
            const {data} = resp

            console.log(data)
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <div className="container mx-auto px-4 text-center">
                <h1 className="mb-12">Testing Twitter Bot Functionality</h1>

                <form onSubmit={handleSubmit}>
                    <button className="py-2 px-3 bg-green-500" type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
}

export default TwitterBot;