// from https://gist.github.com/kurtsson/3f1c8efc0ccd549c9e31
/*function formatXml(xml) {
  let formatted = '';
  let reg = /(>)(<)(\/*)/g;
  xml = xml.toString().replace(reg, '$1\r\n$2$3');
  let pad = 0;
  let nodes = xml.split('\r\n');
  for (let n in nodes) {
    let node = nodes[n];
    let indent = 0;
    if (node.match(/.+<\/\w[^>]*>$/)) {
      indent = 0;
    } else if (node.match(/^<\/\w/)) {
      if (pad !== 0) {
        pad -= 1;
      }
    } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
      indent = 1;
    } else {
      indent = 0;
    }

    let padding = '';
    for (let i = 0; i < pad; i++) {
      padding += '  ';
    }

    formatted += padding + node + '\r\n';
    pad += indent;
  }
  return formatted;
}



function escapeXml(xmlRaw) {
  return xmlRaw.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/ /g, '&nbsp;').replace(/\n/g,'<br />');

}

const serializeAndPrintXML = (xmlText) => {
  const formattedXML = formatXml(xmlText);
  document.querySelector('#output').innerHTML =
      '<pre>'+escapeXml(formattedXML)+'</pre>';
};

let xml = '<hello>world</hello>';
serializeAndPrintXML(xml);

const createElement = (name, value) => { return '<'+name+'>'+value+'</'+name+'>'; };
const makarooniElement = createElement('title_fi', 'makaroonilaatikko'); // <title_fi>makaroonilaatikko</title_fi>
                        */
const output= document.querySelector('#output');


const weekdays=[
  'sunnuntai',
  'maanantai',
  'tiistai',
    'keskiviikko',
    'torstai',
    'perjantai',
    'lauantai',
];

const restaurants=[
  16435,
  16363,
  16364,
  16362
];
const currentDate=() =>{
  const date = new Date();
  return {
    year: date.getFullYear(),
    month: date.getMonth(),
    day: date.getDate(),
    weekday: date.getDay(),
    hour: date.getHours(),
    minutes: date.getMinutes()
  };
};

const fetchSearch=(restaurant, date, dateAdd,monthAdder)=>{
  const currentDay = new Date();
  currentDay.setDate(date.day+dateAdd);
  if(dateAdd>0 && currentDay.getDate()===1) monthAdder++;
  const url =  `https://www.sodexo.fi/ruokalistat/output/daily_json/${restaurant}/${date.year}/${date.month+monthAdder}/${currentDay.getDate()}/fi`;
  fetch(url,{
    headers: {
      'Access-Control-Allow-Origin': 'aSasasASd',
    },
  }).then( (response) => {
    return response.json();
  }).then( (result) => {

    let courseXML =`<Menu>
    <location>
    <ref-title>${result.meta.ref_title}</ref-title>                    
    <ref-url>${result.meta.ref_url}</ref-url>                          
    <week>
    <day>
    <name>${weekdays[currentDay.getDay()]}</name>                                       
    <date>${currentDay.getDate()}</date>`;

    for(let course of result.courses){
      courseXML += `<course>
      <title_fi>${course.title_fi}</title_fi>        
      <title_en>${course.title_en}</title_en>        
      <price>${course.price}</price>                 
      <properties>${course.properties}</properties>  
      </course>`
    }
    courseXML +=`</course>                                                                  
    </day>                                                                     
    </week>                                                                    
    </location>                                                                
    </Menu>`;

    console.log(courseXML);
    output.innerHTML += courseXML +'<br>';

  });
};
for(rest of restaurants){
  let monthAdder= 1;
  for(let i=0;i<5;i++){
    fetchSearch(rest,currentDate(),i,monthAdder);

  }
}

