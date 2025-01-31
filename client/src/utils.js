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
                                @page {
                                    size: 3in 5in;
                                    size: landscape;
                                }
                              
  
                              body {
                              width: 80%;
                              height: 100%;
                              margin: 0 0 0 45px;
                              padding: 0;
                              display: flex;
                              place-content: center;
                              align-items: center;
                              font-size: 40px;
                              gap: 30px;
                              }
                              body:last-child {
                                line-height: 10px;
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

export const PrintNotes = (el, machine) => {
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
                                width: 80%;
                                height: 100%;
                                margin: 0 0 0 45px;
                                padding: 0;
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                                font-size: 28px;
                                }

                                ul {
                                    display: flex;
                                    flex-direction: column;
                                    gap: 25px;
                                    list-style: none;
                                }

                                ul li button {
                                display: none;
                                }
                                
    
                                * {
                                box-sizing: border-box;
                                }
                            }
                        </style>
                    </head>
                    <body>
                        <h1>${machine.make} ${machine.style}</h1>
                        <p><b>Model: </b>${machine.model}</p>
                        ${printable}
                    </body>
                </html>
            `);
  printWindow.document.close();
  printWindow.print();
  printWindow.close();
};
