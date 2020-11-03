import React, {useState, useEffect} from "react";

import "./App.css";
import styles from "./app.module.css";
import {CircularProgress} from "@material-ui/core";
import https from 'https';

const axios = require('axios').default
const GENERATOR_URL = 'https://mzucwve831.execute-api.us-east-1.amazonaws.com/default/flotiq-form-generator'
let tries = 0;
const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
}

let interval = setInterval(() => {
}, 1000000000);


function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

const FormPart = ({title, value, setValue}) => {
    return (
        <div>
            <label>
                <h3>{title}</h3>
                <input
                    className={styles.input}
                    type="text"
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                />
            </label>
        </div>
    )
}

const useScript = url => {
    useEffect(() => {
        const styles = document.createElement("link");
        styles.href = "../src/styles.css";
        styles.rel="stylesheet";
        let script
        console.log('inside UseScript')

        script = document.createElement('script');

        script.src = url;
        script.async = true;

        document.body.appendChild(script);
        clearInterval(interval)

        return () => {
            document.body.removeChild(script);
        }
    }, [url]);
};



/*const isFormReady = async (url, formUrl, setFormUrl) => {
    console.log('inside isFormReady')
    const res = await axios.get(url).catch((e) => console.log(e));
    console.log(res)
    if (res && (res.status === 200))
        return url;
    return ''
}*/

const App = () => {

    const [flotiqApiKeyADD, setFlotiqApiKeyADD] = useState(
        "0be89aa558c1a1d1d0d2a03a806b0349"
    );
    const [flotiqApiKeyGET, setFlotiqApiKeyGET] = useState(
        "3c1b21dcab3a2ec438fb3ef542e36488"
    );
    const [CTDslug, setCTDslug] = useState('contact')

    const [userIdentifier, setUserIdentifier] = useState(
        '318e11093182afdde7980058ff0f8808');
    const [origin, setOrigin] = useState(
        '*'
    )

    const [isFetching, setIsFetching] = useState(false)

    const [formURL, setFormURL] = useState(``)
    const [isReady, setIsReady] = useState(false);


    useScript(formURL, isReady)
    const submit = async () => {
        let url;
        setIsFetching(true)
        await axios.post(GENERATOR_URL, {
            'flotiqApiKeyADD': flotiqApiKeyADD,
            'flotiqApiKeyGET': flotiqApiKeyGET,
            'CTDslug': CTDslug,
            'userIdentifier': userIdentifier,
            'origin': origin
        }).then((res) => {
            console.log(res)
            console.log(res.data.formURL)
            if (res.status === 200) {
                url = res.data.formURL;
            } else throw new Error();
            setIsFetching(false)
        }).catch((err) => {
            console.log(err)
        })
        setIsReady(true)
        console.log('waiting')
        await sleep(10000)
        console.log('waiting ends there')


        setFormURL(url)


    };


    return (
        <div className={styles.container}>
            <div className={styles.column}>
                <h1>Flotiq Forms: </h1>
                <form onSubmit={async () => await submit()}>
                    <FormPart title={"Flotiq Add API key: "} value={flotiqApiKeyADD} setValue={setFlotiqApiKeyADD}/>
                    <FormPart title={"Flotiq Get API key: "} value={flotiqApiKeyGET} setValue={setFlotiqApiKeyGET}/>
                    <FormPart title={"Flotiq CTD slug: "} value={CTDslug} setValue={setCTDslug}/>
                    <FormPart title={"Flotiq userIdentifier: "} value={userIdentifier} setValue={setUserIdentifier}/>
                    <FormPart title={"Origin of requests: "} value={origin} setValue={setOrigin}/>

                    <input type="button" value="Create Flotiq Forms!" onClick={submit}/>
                </form>
            </div>
            {isReady ?
                (<div className={styles.column}>
                        <flotiq-form/>
                    </div>
                )
                :
                ((isFetching ?
                        (<div className={styles.column}>
                            <div className={styles.centerContent}>
                                <CircularProgress size={300}/>
                            </div>
                        </div>)
                        :
                        (<div className={styles.column}>
                            <div className={styles.centerContent}><h1>Tutaj będzie się wyświetlał formularz : )</h1>
                            </div>
                        </div>)
                ))
            }
        </div>
    );
};

export default App;
