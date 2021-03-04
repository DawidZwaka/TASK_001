import React from 'react';
import Image from 'material-ui-image';

class SatelliteImage extends React.Component {
    constructor(props) {
        super(props);

        this.endpoint = "https://api.nasa.gov/planetary/earth/assets";
        this.api_key = process.env.REACT_APP_NASA_API_KEY;
    }

    state = {
        src: '',
        id: '',
    }

    componentDidUpdate() {
        const { props: { lat, lon } } = this;

        if (lat && lon) this.getImage();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (nextProps !== this.props || this.state.id !== nextState.id);
    }

    getImage = async () => {
        const { props: { lon, lat, date, dim }, endpoint, api_key } = this,
            url = new URL(endpoint),
            params = { api_key, lon, lat, dim, date };

        url.search = new URLSearchParams(params).toString();

        try {
            const req = await fetch(url);
            const json = await req.json();

            this.setState({ src: json.url, id: json.id });
        } catch (err) {
            this.props.resolveError({ ...err, code: 500 });
        }
    }

    render() {
        const { state: { src }, props: { lat, lon } } = this;

        return lat && lon ? <Image src={src} aspectRatio={(16 / 9)} style={{ width: '100%', height: '100%' }} /> : null;

    }
}

export default SatelliteImage;
