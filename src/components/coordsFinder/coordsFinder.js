import React from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { CircularProgress, TextField } from '@material-ui/core';

class CoordsFinder extends React.PureComponent {
    constructor(props) {
        super(props);

        this.timeoutId = 0;
        this.endpoint = "https://api.mapbox.com/geocoding/v5/mapbox.places/";
        this.api_key = process.env.REACT_APP_MAPBOX_API_KEY;
    }

    state = {
        prevTimeoutId: 0,
        open: false,
        options: [],
        value: '',
        localization: {
            name: '',
            center: [0, 0]
        }
    }


    parseAPIOutput = (output) => {
        const { features } = output;

        const parsedOutput = features.map(({ place_name, center }) => ({
            name: place_name, center
        }));

        return parsedOutput;
    }

    getPlacesFromAPI = async (query) => {
        const { api_key } = this;
        const url = new URL(`${query}.json`, this.endpoint);
        const params = {
            access_token: api_key
        };

        url.search = new URLSearchParams(params).toString();

        try {
            const res = await fetch(url, { method: "GET" });
            const json = await res.json();

            this.setState({ options: this.parseAPIOutput(json) });
        } catch (err) {
            this.props.resolveError({ ...err, code: 500 });
        }
    }

    sendRequestResolver = () => {
        this.getPlacesFromAPI(this.state.value);
    }

    onOpenHandler = () => this.setState({ open: true });

    onCloseHandler = () => this.setState({ open: false });

    onInputChangeHandler = (ev, value) => {
        if (value !== '' && !this.state.options.find(({ name }) => name === value)) {
            clearTimeout(this.state.prevTimeoutId);
            const prevTimeoutId = setTimeout(this.sendRequestResolver, 500);

            this.setState({ prevTimeoutId, value });
        }

        this.setState({ value });
    }

    onChangeHandler = (ev, newVal) => {
        this.props.resolveError({ code: 200 });

        this.props.setLocalization(newVal);
    }

    getOptionSelectedHandler = (option, value) => {

        return option.name === value;
    }
    getOptionLabelHandler = (option) => typeof option === 'string' ? option : option.name;

    render() {
        const {
            onCloseHandler,
            onOpenHandler,
            onInputChangeHandler,
            onChangeHandler,
            getOptionLabelHandler,
            getOptionSelectedHandler,
            state: {
                open,
                options,
                value
            }
        } = this;
        const loading = false;

        return (
            <Autocomplete
                id="location-finder"
                style={{ width: 300 }}
                open={open}
                onOpen={onOpenHandler}
                onClose={onCloseHandler}
                getOptionLabel={getOptionLabelHandler}
                getOptionSelected={getOptionSelectedHandler}
                onChange={onChangeHandler}
                onInputChange={onInputChangeHandler}
                filterOptions={(x) => x}
                options={options}
                loading={loading}
                value={value}
                autoComplete
                includeInputInList
                filterSelectedOptions
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Enter a location"
                        variant="outlined"
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <React.Fragment>
                                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </React.Fragment>
                            ),
                        }}
                    />
                )}
            />
        );

    }
}

export default CoordsFinder;