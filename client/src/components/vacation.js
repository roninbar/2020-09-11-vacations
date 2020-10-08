import { Badge, Box, Button, Card, CardActions, CardContent, CardMedia, ClickAwayListener, IconButton, TextField as MuiTextField, Typography, withStyles } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { ToggleButton } from '@material-ui/lab';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { Html5Entities } from 'html-entities';
import _ from 'lodash';
import React, { PureComponent } from 'react';

const entities = new Html5Entities();

const TextField = withStyles({
    form: {
        flexGrow: 1,
        display: 'flex',
        flexFlow: 'row nowrap',
    },
})(
    function ({ classes, onSubmit, onClickAway, ...rest }) {
        return (
            <ClickAwayListener onClickAway={onClickAway}>
                <form className={classes.form} onSubmit={onSubmit}>
                    <MuiTextField fullWidth={true} {...rest} />
                </form>
            </ClickAwayListener>
        );
    }
)

class Vacation extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            editing: 'nothing',
            fields: {},
        };
    }

    quitEditing() {
        this.setState({
            fields: {},
            editing: 'nothing',
        });
    }

    onClickEditButton(what) {
        this.setState({
            editing: what,
        });
    }

    onChange({ target: { name, value } }) {
        this.setField(name, value);
    }

    onChangeDate(name, date, value) {
        this.setField(name, value);
    }

    onAcceptDate(name, date) {
        this.setField(name, date.format('yyyy-MM-DD'));
    }

    setField(name, value) {
        const { fields } = this.state;
        this.setState({
            fields: {
                ...fields,
                [name]: value,
            },
        });
    }

    onSubmitTextField(e) {
        e.preventDefault();
        this.fireChangeFields();
    }

    onSubmitDates(e) {
        e.preventDefault();
        this.fireChangeFields();
    }

    onKeyUp(e) {
        if (e.key === 'Escape') {
            this.quitEditing();
        }
    }

    onClickAway() {
        this.fireChangeFields();
    }

    fireChangeFields() {
        const { fields } = this.state;
        if (!_.isEmpty(fields)) {
            const { onChangeFields } = this.props;
            onChangeFields(fields);
        }
        this.quitEditing();
    }

    /**
     * Method to call when a content-editable element loses focus.
     * @param {string} name Name of field to update
     * @param {Event} param1 "Blur" event
     */
    onBlur(name, { target: { innerText: value } }) {
        const { onChangeFields, [name]: prevValue } = this.props;
        if (value !== prevValue) {
            return onChangeFields({ [name]: value });
        }
    }

    render() {
        const { destination, from, to, price, description, image, followers, isFollowing, onChangeFollowing, onDelete, userRole, classes } = this.props;
        const { editing } = this.state;

        return (
            <Card className={classes.root}>

                <CardMedia className={classes.media + (editing === 'image' ? ' editing' : '')} image={image} title={destination}>
                    {userRole === 'admin' &&
                        <div className="overlay">
                            {editing === 'image'
                                ? (
                                    <TextField
                                        variant="outlined"
                                        autoFocus
                                        type="text"
                                        name="image"
                                        value={typeof this.state.fields?.image === 'string' ? this.state.fields?.image : image}
                                        onChange={this.onChange.bind(this)}
                                        onSubmit={this.onSubmitTextField.bind(this)}
                                        onClickAway={this.onClickAway.bind(this)}
                                        onKeyUp={this.onKeyUp.bind(this)}
                                        inputProps={{
                                            pattern: '^(?:([A-Za-z]+):)?(\\/{0,3})([0-9.\\-A-Za-z]+)(?::(\\d+))?(?:\\/([^?#]*))?(?:\\?([^#]*))?(?:#(.*))?$',
                                        }}
                                        className={classes.imageEditTextField}
                                    />)
                                : (
                                    <IconButton className={classes.imageEditButton} onClick={this.onClickEditButton.bind(this, 'image')}>
                                        <EditIcon />
                                    </IconButton>)
                            }
                        </div>
                    }
                </CardMedia>

                <CardContent>

                    {/* Destination */}
                    {editing === 'destination'
                        ? (
                            <TextField
                                variant="outlined"
                                name="destination"
                                value={typeof this.state.fields?.destination === 'string' ? this.state.fields?.destination : destination}
                                onChange={this.onChange.bind(this)}
                                onSubmit={this.onSubmitTextField.bind(this)}
                                onClickAway={this.onClickAway.bind(this)}
                                onKeyUp={this.onKeyUp.bind(this)}
                                autoFocus
                            />
                        ) : (
                            <Typography className={classes.contentRow} variant="h5" gutterBottom>
                                {destination}
                                {userRole === 'admin' && editing === 'nothing' &&
                                    <div className="overlay">
                                        <IconButton onClick={this.onClickEditButton.bind(this, 'destination')}>
                                            <EditIcon />
                                        </IconButton>
                                    </div>
                                }
                            </Typography>
                        )
                    }

                    {/* Dates */}
                    {editing === 'dates'
                        ? (
                            <form onSubmit={this.onSubmitDates.bind(this)}>
                                <KeyboardDatePicker
                                    disablePast
                                    disableToolbar
                                    variant="inline"
                                    format="yyyy-MM-DD"
                                    margin="normal"
                                    label="Start Date"
                                    name="from"
                                    value={this.state.fields?.from || from}
                                    onChange={this.onChangeDate.bind(this, 'from')}
                                    onAccept={this.onAcceptDate.bind(this, 'from')}
                                />
                                <KeyboardDatePicker
                                    disablePast
                                    disableToolbar
                                    variant="inline"
                                    format="yyyy-MM-DD"
                                    margin="normal"
                                    label="End Date"
                                    name="to"
                                    value={this.state.fields?.to || to}
                                    onChange={this.onChangeDate.bind(this, 'to')}
                                    onAccept={this.onAcceptDate.bind(this, 'to')}
                                />
                                <Button type="submit">Update</Button>
                            </form>)
                        : (
                            <Typography className={classes.contentRow} variant="subtitle1" gutterBottom>
                                <Box fontWeight="fontWeightBold"
                                    onBlur={this.onBlur.bind(this, 'dates')}
                                >
                                    {entities.decode(`${from.toDateString()}&ndash;${to.toDateString()}`)}
                                </Box>
                                {userRole === 'admin' && editing === 'nothing' &&
                                    <div className="overlay">
                                        <IconButton onClick={this.onClickEditButton.bind(this, 'dates')}>
                                            <EditIcon />
                                        </IconButton>
                                    </div>
                                }
                            </Typography>
                        )
                    }

                    {/* Description */}
                    <Typography
                        className={classes.contentRow}
                        variant="body1"
                        gutterBottom component="div"
                        contentEditable={userRole === 'admin'}
                        suppressContentEditableWarning={true}
                        onBlur={this.onBlur.bind(this, 'description')}
                    >
                        {description}
                    </Typography>

                    {/* Price */}
                    <Typography className={classes.contentRow} variant="h6">
                        <Box fontWeight="fontWeightBold">
                            &euro;
                            <span
                                contentEditable={userRole === 'admin'}
                                suppressContentEditableWarning={true}
                                onBlur={this.onBlur.bind(this, 'price')}
                            >
                                {price}
                            </span>
                        </Box>
                    </Typography>

                </CardContent>

                <CardActions className={classes.actions}>
                    {userRole === 'user' &&
                        <Badge badgeContent={followers} color="primary">
                            <ToggleButton value="check" selected={Boolean(isFollowing)} onChange={() => onChangeFollowing(!isFollowing)} >
                                <Typography variant="button">Follow</Typography>
                            </ToggleButton>
                        </Badge>
                    }
                    {userRole === 'admin' &&
                        <IconButton onClick={onDelete}>
                            <DeleteIcon />
                        </IconButton>
                    }
                </CardActions>

            </Card >
        );
    }

}

const styles = {
    root: {
    },
    media: {
        position: 'relative',
        height: 140,
        '& .overlay': {
            display: 'flex',
            flexFlow: 'row-reverse nowrap',
            position: 'absolute',
            right: 0,
            bottom: 0,
            left: 0,
            opacity: 0,
            backgroundColor: 'black',
        },
        '&:hover .overlay': {
            opacity: 0.5,
        },
        '&.editing .overlay': {
            opacity: 1,
        },
    },
    imageEditTextField: {
        backgroundColor: 'white',
    },
    imageEditButton: {
        color: 'rgba(255, 255, 255, 1.0)',
    },
    contentRow: {
        position: 'relative',
        '& .overlay': {
            display: 'none',
            flexDirection: 'row-reverse',
            position: 'absolute',
            right: 0,
            bottom: 0,
            left: 0,
        },
        '&:hover .overlay': {
            display: 'flex',
        },
    },
    actions: {
        flexDirection: ({ userRole }) => userRole === 'admin' ? 'row-reverse' : 'row',
    },
};

export default withStyles(styles)(Vacation);

