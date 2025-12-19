import ffmpeg from 'fluent-ffmpeg';
   import ffmpegPath from '@ffmpeg-installer/ffmpeg';

   ffmpeg.setFfmpegPath(ffmpegPath.path);

   // Your video paths
   const videos = [
     { input: './public/images485573257456374938/collection3/11.mp4', output: './public/images485573257456374938/thumbs/collection3/11.jpg' },
     { input: './public/images485573257456374938/collection4/2.mp4', output: './public/images485573257456374938/thumbs/collection4/2.jpg' },
     { input: './public/images485573257456374938/collection4/23.mp4', output: './public/images485573257456374938/thumbs/collection4/23.jpg' },
          { input: './public/images485573257456374938/collection4/34.mp4', output: './public/images485573257456374938/thumbs/collection4/34.jpg' },
     { input: './public/images485573257456374938/collection5/16.mp4', output: './public/images485573257456374938/thumbs/collection5/16.jpg' },
     { input: './public/images485573257456374938/collection9/16.mp4', output: './public/images485573257456374938/thumbs/collection9/16.jpg' },
     { input: './public/images485573257456374938/collection12/23.mp4', output: './public/images485573257456374938/thumbs/collection12/23.jpg' },
     { input: './public/images485573257456374938/collection14/12.mp4', output: './public/images485573257456374938/thumbs/collection14/12.jpg' },
     { input: './public/images485573257456374938/collection9/17.mp4', output: './public/images485573257456374938/thumbs/collection9/17.jpg' },
     { input: './public/images485573257456374938/collection9/18.mp4', output: './public/images485573257456374938/thumbs/collection9/18.jpg' },
     { input: './public/images485573257456374938/collection9/19.mp4', output: './public/images485573257456374938/thumbs/collection9/19.jpg' },
     // Add your other videos here
   ];

   videos.forEach(({ input, output }) => {
     ffmpeg(input)
       .screenshots({
         timestamps: ['2'],
         filename: output.split('/').pop(),
         folder: output.substring(0, output.lastIndexOf('/')),
         size: '600x?'
       })
       .on('end', () => console.log(`✅ Created: ${output}`))
       .on('error', (err) => console.error(`❌ Error: ${err.message}`));
   });