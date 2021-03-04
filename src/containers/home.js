import React from 'react';
import SatelliteImage from '../components/satelliteImage/satelliteImage';
import CoordsFinder from '../components/coordsFinder/coordsFinder';
import SimpleMap from '../components/simpleMap/simpleMap';
import { Container, Grid } from '@material-ui/core';

class Home extends React.PureComponent {
    constructor(props) {
        super(props);

        this.static = {
            title: 'NASA Image Finder'
        }
        this.initState = {
            lat: undefined,
            lon: undefined,
            name: '',
            error: undefined
        }
    }

    state = { ...this.unsetState }

    resolveError = (err) => {
        let res = undefined;

        switch (err.code) {
            case 200: break;
            case 500:
            default: {
                res = "Something went wrong. Please try again later. :(";
                break;
            }
        }

        this.setState({ error: res });
    }

    unsetState = () => this.setState(this.initState);

    setLocalizationHandler = (localization) => {
        if (!localization)
            return this.unsetState();

        const { center, name } = localization;
        const [lon, lat] = center;

        this.setState({ lat, lon, name });
    }

    render() {
        const {
            state: { lat, lon, name: locationName, error },
            static: { title }
        } = this;

        return (
            <Container maxWidth="lg">
                <Grid container direction="column" justify="flex-start" alignItems="center">
                    <h1>{title}</h1>
                    <CoordsFinder resolveError={this.resolveError} setLocalization={this.setLocalizationHandler} />
                    {error ? <p>{error}</p> : (
                        <>
                            <h3>{locationName}</h3>
                            <Grid container item xs={12}>
                                <SatelliteImage resolveError={this.resolveError} dim="0.1" lat={lat} lon={lon} date="2018-03-03" />
                            </Grid>
                            <Grid container item xs={12}>
                                <SimpleMap lat={lat} lon={lon} zoom="1" />
                            </Grid>
                        </>)}
                </Grid>
            </Container >);
    }
}

export default Home;