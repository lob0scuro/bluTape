export const PrintLabel = (el) => {
  let printable = document.getElementById(el).innerHTML;
  let printWindow = window.open("", "", "height=500, width=500");
  printWindow.document.open();
  printWindow.document.write(`
              <html>
                  <head>
                      <title>Print Label</title>
                      <style>
                          @media print {
                              
  
                              body {
                              width: 2in;
                              height: 2in;
                              margin: 0;
                              padding: 0;
                              display: flex;
                              flex-direction: column;
                              align-items: center;
                              justify-content: center;
                              text-align: center;
                              font-size: 12px;
                              }
  
                              * {
                              box-sizing: border-box;
                              }
                          }
                      </style>
                  </head>
                  <body>
                      ${printable}
                  </body>
              </html>
          `);
  printWindow.document.close();
  printWindow.print();
  printWindow.close();
};
