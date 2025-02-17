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
                                    size: 4in 2in;
                                    margin: 0;
                                }
                              
  
                              body {
                              height: 406px;
                              width: 812px;
                              margin: 0;
                              padding: 0;
                              display: flex;
                              justify-content: center;
                              align-items: center;
                              font-size: 22px;
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
                                font-size: 18px;
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

window.PrintLabel = PrintLabel;
window.PrintNotes = PrintNotes;

// export machine list to EXCEL and add to archives

export const printZPL = (machine) => {
  const zpl = `^XA
^FO25,25^GB750,375,6^FS
^FO200, 60^A0,35^FDbluTape/ Matt's Appliances^FS
^FO90,105^BQN,2,8^FDLA,https://blutape.net/repair-card/${machine.id}^FS
^FO350,130^A0,35^FDID: ${machine.id}^FS
^FO350,175^A0,35^FDBrand: ${machine.make}^FS
^FO350,220^A0,35^FDModel: ${machine.model}^FS
^FO350,265^A0,35^FDSerial: ${machine.serial}^FS
^FO350,310^A0,35^FDStyle: ${machine.style}^FS
^XZ`;
  //NEED TO HOOK UP PRINTER TO ROUTER TO GET PROPER IP ADDR

  fetch("/api/print", {
    method: "POST",
    headers: {
      "Content-Type": "text/plain",
    },
    body: zpl,
  })
    .then((response) => {
      if (response.ok) {
        alert("Label sent to printer");
      } else {
        alert("There was an error");
      }
    })
    .catch((error) => {
      alert(`Error: ${error}`);
    });
};
