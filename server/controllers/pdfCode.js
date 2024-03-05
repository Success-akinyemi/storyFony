// Create PDF
/**

export async function generatePdf(req, res) {
  const { id, userId } = req.body;
  try {
    console.log('WORKING');
    const story = await UserStory.findById(id);

    if (!story) {
      return res.status(405).json({ success: false, data: 'Story not found' });
    }

    const doc = new pdfkit();
    const outputFilePath = `${story.title ? story.title : story.userTitle}-${story.author}.pdf`;

    // Add Cover Image on the first page
    doc.addPage();
    await downloadAndEmbedImage(doc, story.coverImage);

    // Add Title and author name on the next page
    doc.addPage();
    const titleText = story.title ? story.title : story.userTitle;
    const authorText = `Author: ${story.author}`;
    const centerX = doc.page.width / 2;
    const centerY = doc.page.height / 2;
    doc.fontSize(24).text(titleText, centerX, centerY - 20, { align: 'center' });
    doc.fontSize(16).text(authorText, centerX, centerY + 20, { align: 'center' });

    // Track current Y position
    let currentY = doc.y;

    // Add chapters
    for (const chapter of story.story) {
      // Add chapter content
      doc.addPage();
      doc.fontSize(20).text(chapter.chapterTitle, { align: 'center' });
      doc.fontSize(18).text(chapter.chapterNumber, { align: 'center' });
      doc.fontSize(16).text(chapter.chapterContent);

      // Embed chapter image on the same page
      await downloadAndEmbedImage(doc, chapter.chapterImage);

      // Track current Y position for the next chapter
      currentY = doc.y;
    }

    // Add story image on the last page
    doc.addPage();
    await downloadAndEmbedImage(doc, story.storyImage);

    // Add promotion text on a separate page
    doc.addPage().fontSize(16).text('Made and Produced by Story Generator', { align: 'center' });
    doc.text(`Visit ${process.env.MAIL_WEBSITE_LINK}`, { align: 'center' });

    // End the document
    doc.end();

    // Save PDF to server file
    const stream = fs.createWriteStream(outputFilePath);
    doc.pipe(stream);

    // Once the stream is closed, send the response
    stream.on('finish', () => {
      res.download(outputFilePath, (err) => {
        if (err) {
          console.error('Error sending PDF to client:', err);
          res.status(500).json({ success: false, data: 'Could not send the PDF to the client' });
        } else {
          console.log('PDF sent to client successfully');
          // Optionally, delete the file after sending
          //fs.unlinkSync(outputFilePath);
        }
      });
    });

  } catch (error) {
    console.log('COULD NOT GENERATE STORY', error);
    res.status(500).json({ success: false, data: 'Could not create the PDF' });
  }
}
 */

// Function to download and embed image into PDF
/**

async function downloadAndEmbedImage(doc, imageUrl, yPos = doc.y) {
  try {
    console.log('WORK');
    const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(imageResponse.data, 'binary');

    // Embed the image into the PDF document at yPos
    doc.image(imageBuffer, { width: 300, y: yPos });

  } catch (error) {
    console.error('Error downloading and embedding image:', error);
    // Handle error accordingly
    throw error; // Rethrow error to be caught by the caller
  }
}
 */




/**
 export async function generatePdf(req, res) {
   const { id, userId } = req.body;
   try {
     console.log('WORKING');
     const story = await UserStory.findById(id);
 
     if (!story) {
       return res.status(405).json({ success: false, data: 'Story not found' });
     }
 
     const doc = new pdfkit();
     const outputFileName = `${story.title ? story.title : story.userTitle}-${story.author}.pdf`;
     const outputFilePath = path.join(getDirname(import.meta.url), outputFileName); // Using getDirname
 
     // Add Cover Image on the first page
     await downloadAndEmbedImage(doc, story.coverImage);
 
     // Add Title and author name on the next page
     doc.addPage();
     const titleText = story.title ? story.title : story.userTitle;
     const authorText = `Author: ${story.author}`;
     const centerX = doc.page.width / 2;
     const centerY = doc.page.height / 2;
     doc.fontSize(24).text(titleText, centerX, centerY - 20, { align: 'center' });
     doc.fontSize(16).text(authorText, centerX, centerY + 20, { align: 'center' });
 
     // Track current Y position
     let currentY = doc.y;
 
     // Add chapters
     for (const chapter of story.story) {
       // Add chapter content
       doc.addPage();
       doc.fontSize(20).text(chapter.chapterTitle, { align: 'center' });
       doc.fontSize(18).text(chapter.chapterNumber, { align: 'center' });
       doc.fontSize(16).text(chapter.chapterContent);
 
       // Embed chapter image on a fresh page
       doc.addPage();
       await downloadAndEmbedImage(doc, chapter.chapterImage);
 
       // Track current Y position for the next chapter
       currentY = doc.y;
     }
 
     // Add story image on the last page
     doc.addPage();
     await downloadAndEmbedImage(doc, story.storyImage);
 
     // Add promotion text on a separate page
     doc.addPage().fontSize(16).text('Made and Produced by Story Generator', { align: 'center' });
     doc.text(`Visit ${process.env.MAIL_WEBSITE_LINK}`, { align: 'center' });
 
     // Save PDF to server file
 
     const stream = fs.createWriteStream(outputFilePath);
     doc.pipe(stream);
 
     // Once the stream is closed, send the response
     stream.on('finish', () => {
       res.sendFile(outputFilePath, (err) => {
         if (err) {
           console.error('Error sending PDF to client:', err);
           res.status(500).json({ success: false, data: 'Could not send the PDF to the client' });
         } else {
           console.log('PDF sent to client successfully');
           // Optionally, delete the file after sending
           // fs.unlinkSync(outputFilePath);
         }
       });
     });
      
 
     // End the document
     doc.end();
 
   } catch (error) {
     console.log('COULD NOT GENERATE STORY', error);
     res.status(500).json({ success: false, data: 'Could not create the PDF' });
   }
 }
 
 */