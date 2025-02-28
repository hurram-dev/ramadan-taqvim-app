import path from 'path';
import { promises as fs } from 'fs';

export async function GET(request) {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('query')


    const jsonDirectory = path.join(process.cwd(), 'public');
    // Read the "data.json" file
    const fileContents = await fs.readFile(jsonDirectory + '/data/taqvim.json', 'utf8');
    const taqvimData = await JSON.parse(fileContents);
    if(query === 'today') {
        const today = new Date()
        today.setHours(0, 0, 0,0)

        // Filter today's taqvim
        const todaysTaqvim = taqvimData.find(day => {
            return new Date(day.date).getTime() === today.getTime()
        });

        return Response.json(todaysTaqvim ?? taqvimData[0])
    }

    return Response.json(taqvimData);


}