export default function sitemap(){
    return [
        {
            url: 'https://ramazon-taqvimi.vercel.app/',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: 'https://ramazon-taqvimi.vercel.app/full-taqvim',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        }
    ]
}
