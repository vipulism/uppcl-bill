import axios, { AxiosRequestConfig } from "axios";
import { useState } from "react";

interface DATA_TYPE {
    date:number[];
    grid:number[];
    dg:number[];
}

interface FORM_TYPE {
    line: 'grid' | 'dg';
    flat_no:number;
    date:string;
}

type formValues = FORM_TYPE[keyof FORM_TYPE];

const prevMonth = new Date();
    prevMonth.setDate(1);
    prevMonth.setMonth(prevMonth.getMonth()-1)

export default function Bill() {

    const [data, setData] = useState({ date:[], grid:[], dg:[]});
    const [gridUnits, setGridUnits] = useState(0);
    const [reportType, setReportType] = useState<'daily' | 'monthly'>('daily');
    const [ totalUnits, setTotalUnits] = useState(0);
    const [ maxDate, setMaxDate] = useState((new Date()).toLocaleDateString('en-CA'));
    const [ minDate, setMinDate] = useState(prevMonth.toLocaleDateString('en-CA'));


    function reportTypeSelection(e){
        console.log('report Type', e.target.value);
        setReportType(e.target.value);
       

         if(e.target.value === 'monthly'){
            const mxd = maxDate.split('-');
            mxd.pop();
            setMaxDate(() => mxd.join('-'));

            const mnd = minDate.split('-');
            mnd.pop();
            setMinDate(() => mnd.join('-'));

         }else {
            setMaxDate(() => (new Date()).toLocaleDateString('en-CA'));
            setMinDate(() =>  prevMonth.toLocaleDateString('en-CA'));
         }

    }

  function getData(e) {
   
    e.preventDefault();

    // Read the form data
    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries()) ;
    console.log(formJson);
    const date = new Date(formJson.date as string);
    const requestedDate = date.getDate();

    const currentMonth = 'get_daily_chart_data';
    const prevMonth = 'get_previous_month_data';

    const month = date.getMonth() === (new Date()).getMonth() ? currentMonth : prevMonth;

    const API = `https://uppcl.p.rapidapi.com/Prepaid_data_daily_log_gridHelper/${month}/50015205${formJson.flat_no || 1201}`;
   
    const options = {
        method: 'GET',
        url: API,
        headers: {
          'X-RapidAPI-Key': '35b2994e2fmshfa74597d89bcaabp1f7588jsn59b8aaa9450f',
          'X-RapidAPI-Host': 'uppcl.p.rapidapi.com'
        }
      };
       
      axios.request(options as AxiosRequestConfig).then(function (response) {
        // console.log(response.data);
        setData(response.data);
        const dateIndex = response.data.date.findIndex((d:number) => d === requestedDate);
        const GridUnits = response.data[formJson.line as string][dateIndex];

        setGridUnits(GridUnits);
        setTotalUnits(response.data[formJson.line as string].reduce((a:number, b:number) => a + b))

      }).catch(function (error) {
        console.error(error);
      });
  }

    return (
        <>
            <div>
            <select name="report" id="report" onChange={reportTypeSelection}>
                    <option value="daily">Daily</option>
                    <option value="monthly">Monthly</option>
            </select>
            <form onSubmit={getData}>
                <select name="line" id="line">
                    <option value="dg">DG</option>
                    <option value="grid">Grid</option>
                </select>
                <input type={reportType === 'daily' ? "date" : 'month'} name="date" min={minDate} max={maxDate} id="date" />
                <input type="text" placeholder="Flat No." name="flat_no" id="flat_no" />
                <button type="submit">Get Data</button>
            </form>
                { reportType === 'daily' ? gridUnits : totalUnits}
            </div>
        </>
    )
}