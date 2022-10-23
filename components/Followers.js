import useSWR from 'swr'
import {useRef, useState, useEffect} from "react";
import {signOut} from "next-auth/react";
import Image from 'next/image'

const fetcher = (...args) => fetch(...args).then(res => res.json());

export default function Followers({session}) {
    const [isAutoRefresh, setIsAutoRefresh] = useState(false);
    const ref = useRef(null);

    const {data, error} = useSWR(session ? '/api/twitter/user' : null, fetcher,
        {refreshInterval: isAutoRefresh ? 30000 : 0, revalidateOnFocus: false}
    );

    useEffect(() => {
        if (ref.current) {
            Tilt.init(ref.current, {
                glare: true,
                max: 5,
                'max-glare': 0.16,
                'full-page-listening': false,
                'mouse-event-element': '.twitter-card',
            });
        }
    }, [ref, data]);

    if (data && data.error && data.error.errors[0] && data.error.errors[0].code === 89) {
        signOut();
    }

    if (!data) return <div> Loading... </div>;
    const userData = data.data;

    return (
        <>
            <pre>{JSON.stringify(userData,null,4)}</pre>
        </>
    )
}