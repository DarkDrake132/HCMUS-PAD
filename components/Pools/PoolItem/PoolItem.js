// NEXT COMPONENTS
import Image from "next/image";

// HOOKS
import { useRouter } from "next/router";

// utils
import { getRemainingTimeString } from "../../../utility/DateUtility";
import { roundUp, numberFormatter } from "../../../utility/NumberUtility";

// MUI COMPONENTS
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import Toolbar from "@mui/material/Toolbar";
import { styled } from "@mui/material/styles";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === "light" ? "#1a90ff" : "#308fe8",
  },
}));

const PoolItem = (props) => {
  const router = useRouter();

  let poolStatus;
  if (props.status == "upcoming") {
    poolStatus = (
      <Typography
        variant="subtitle1"
        color="primary"
        sx={{ textAlign: "center" }}
      >
        {getRemainingTimeString(props.beginTime)}
      </Typography>
    );
  } else {
    poolStatus = (
      <>
        <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
          Progress
        </Typography>
        <BorderLinearProgress
          variant="determinate"
          value={roundUp((props.soldAmount / props.tokenAmount) * 100, 2)}
        />
        <Toolbar disableGutters>
          <Typography sx={{ display: "flex", alignSelf: "flex-start" }}>
            {roundUp((props.soldAmount / props.tokenAmount) * 100, 2)}%
          </Typography>
          <Typography
            sx={{
              flexGrow: 1,
              display: "flex",
              alignSelf: "flex-start",
              justifyContent: "flex-end",
            }}
          >
            {roundUp(props.soldAmount)}/{roundUp(props.tokenAmount)}
          </Typography>
        </Toolbar>
      </>
    );
  }
  /*
    Routing to the pool detail
  */
  const redirectToPoolDetail = () => {
    router.push(`/${props.id}`);
  };

  let CardStyle = "HoverBounce";
  if (props.status === "ended") {
    CardStyle += " WhiteBorder";
  }

  const totalRaiseDisplay =
    props.totalRaise > 1
      ? numberFormatter(roundUp(props.totalRaise, 1))
      : roundUp(props.totalRaise);
  const tokenAmountDisplay =
    props.tokenAmount > 1
      ? numberFormatter(roundUp(props.tokenAmount, 1))
      : roundUp(props.tokenAmount);

  return (
    <Card sx={{ width: 400 }}>
      <CardActions
        sx={{ cursor: "pointer", p: 3 }}
        onClick={redirectToPoolDetail}
      >
        <Grid container direction="column">
          <Grid item sx={{ textAlign: "center" }}>
            <Image
              src={props.imgSrc}
              width={150}
              height={150}
              alt={props.name}
            />
          </Grid>
          <Grid item>
            <Typography
              variant="h4"
              sx={{ textAlign: "center", fontWeight: 600 }}
            >
              {props.name}
            </Typography>
          </Grid>
          <Grid item sx={{ mt: 1 }}>
            {poolStatus}
          </Grid>
          <Grid item container sx={{ mt: 3, textAlign: "center" }}>
            <Grid item xs={4}>
              <Typography>Total raise</Typography>
              <Typography variant="h6" color="secondary">
                {totalRaiseDisplay + " " + props.chainName}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography>Total Token</Typography>
              <Typography variant="h6" color="primary">
                {
                  /*Check if the pool is upcoming type*/
                  props.status !== "upcoming" ? tokenAmountDisplay : "TBA"
                }
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography>Participants</Typography>
              <Typography variant="h6" color="primary">
                {
                  /*Check if the pool is upcoming type*/
                  props.status !== "upcoming" ? props.participants : "TBA"
                }
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
};

export default PoolItem;
