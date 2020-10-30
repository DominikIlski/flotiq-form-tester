import React, {useState, useEffect} from "react";

import "./App.css";
import styles from "./app.module.css";
import {CircularProgress} from "@material-ui/core";


const axios = require('axios').default
const GENERATOR_URL = 'https://mzucwve831.execute-api.us-east-1.amazonaws.com/default/flotiq-form-generator'

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
        const script = document.createElement('script');

        script.src = url;
        script.async = true;

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        }
    }, [url]);
};


const App = () => {




    const [flotiqApiKeyADD, setFlotiqApiKeyADD] = useState(
        "0be89aa558c1a1d1d0d2a03a806b0349"
    );
    const [flotiqApiKeyGET, setFlotiqApiKeyGET] = useState(
        "3c1b21dcab3a2ec438fb3ef542e36488"
    );
    const [CTDslug, setCTDslug] = useState('contact')

    const [userIdentifier, setUserIdentifier] = useState(
        'dded760e6aa0313df640588a7f4b01bd');
    const [origin, setOrigin] = useState(
        '*'
    )

    const [isCreated, setIsCreated] = useState(false)

    const [isFetching, setIsFetching] = useState(false)

    const [formURL, setFormURL] = useState(``)
    //const [isFetching, SetIsFetching] = useState(false);
    useScript(formURL)




    const submit = async () => {

        setIsFetching(true)
        axios.post(GENERATOR_URL, {
            'flotiqApiKeyADD': flotiqApiKeyADD,
            'flotiqApiKeyGET': flotiqApiKeyGET,
            'CTDslug': CTDslug,
            'userIdentifier': userIdentifier,
            'origin': origin
        }).then((res) => {
            console.log(res)
            console.log(res.data.formURL)
            if (res.status === 200) {

                setFormURL(res.data.formURL);

                setIsCreated(true);
                setIsFetching(false)

            }

        }).catch((err) => {
            console.log(err)
        })

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
            {isCreated ?
                (<flotiq-form/> ? <div className={styles.column}>
                    <flotiq-form/>
                </div> :
                        (<div className={styles.column}>
                            <div className={styles.centerContent}>
                                <CircularProgress size={300}/>
                            </div>
                        </div>)
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
