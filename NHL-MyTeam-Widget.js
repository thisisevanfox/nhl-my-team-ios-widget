// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: blue; icon-glyph: hockey-puck;

/********************************************************
 * script     : NHL-MyTeam-Widget.js
 * version    : 3.1.0
 * description: Widget for Scriptable.app, which shows
 *              the next games for your NHL team
 * author     : @thisisevanfox
 * support    : https://git.io/JtkA1
 * date       : 2021-02-01
 *******************************************************/

/********************************************************
 ******************** USER SETTINGS *********************
 ************ PLEASE MODIFY BEFORE FIRST RUN ************
 *******************************************************/

// Type the abbreviation of your NHL team here.
// North Division: CGY, EDM, MTL, OTT, TOR, VAN, WPG
// East Division: BOS, BUF, NJD, NYI, NYR, PHI, PIT, WSH
// Central Division: CAR, CHI, CBJ, DAL, DET, FLA, NSH, TBL
// West Division: ANA, ARI, COL, LAK, MIN, STL, SJS, VGK
const MY_NHL_TEAM = "ENTER_TEAM_ABBREVIATION_HERE";

// Indicator if livescores should be shown.
// If you don't want to be spoilered set it to false.
// Default: true
const SHOW_LIVE_SCORES = true;

// Indicator if all scores and stats should be shown.
// If you don't want to be spoilered set it to false.
// Default: true
const SHOW_STATS_AND_STANDINGS = true;

// Indicator if the home team should show first (like it's common in Europe)
// Default: true (home team shows first, e.g. "home - away")
// false (away team shows first, e.g. "away @ home")
const SHOW_HOME_TEAM_FIRST = true;

// URL to shares app
// Default: "nhl://" (Official NHL app)
// If you don't want anything to open, type:
// const WIDGET_URL = "";
const WIDGET_URL = "nhl://";

// Set appearance of the widget. Default apperance is set to the system color scheme.
// Device.isUsingDarkAppearance() = System color scheme (default)
// true = Widget will be in dark mode.
// false = Widget will be in light mode.
const DARK_MODE = Device.isUsingDarkAppearance();

// Indicator if no-background.js is installed
// Default: false
// @see: https://github.com/supermamon/scriptable-no-background
const NO_BACKGROUND_INSTALLED = false;

// Indicator if no-background.js should be active
// Only matters if NO_BACKGROUND_INSTALLED is true.
const NO_BACKGROUND_ACTIVE = true;

// Indicator if no-background.js should be active for whole widget
// No background for widget and no background for stacks in the widget
// Only matters if NO_BACKGROUND_INSTALLED is true.
const NO_BACKGROUND_FULL_ACTIVE = false;

/********************************************************
 ********************************************************
 *********** DO NOT CHANGE ANYTHING FROM HERE ***********
 ********************************************************
 *******************************************************/
const { transparent } = NO_BACKGROUND_INSTALLED
  ? importModule("no-background")
  : emptyFunction();

const WIDGET_BACKGROUND = DARK_MODE ? new Color("gray") : new Color("#D6D6D6");
const STACK_BACKGROUND = DARK_MODE
  ? new Color("#1D1D1D")
  : new Color("#FFFFFF"); //Smaller Container Background

let oNhlWidget;
if (config.runsInWidget) {
  if (config.widgetFamily === "small") {
    oNhlWidget = await createSmallWidget();
  }
  if (config.widgetFamily === "medium") {
    oNhlWidget = await createMediumWidget();
  }
  if (config.widgetFamily === "large") {
    oNhlWidget = await createLargeWidget();
  }
  Script.setWidget(oNhlWidget);
} else {
  oNhlWidget = await createMediumWidget();
  oNhlWidget.presentMedium();
  // oNhlWidget = await createSmallWidget();
  // oNhlWidget.presentSmall();
  // oNhlWidget = await createLargeWidget();
  // oNhlWidget.presentLarge();
}

/**
 * Creates small sized widget.
 *
 * @return {ListWidget}
 */
async function createSmallWidget() {
  // Initialise widget
  const oWidget = new ListWidget();
  oWidget.backgroundColor = DARK_MODE
    ? new Color("1D1D1D")
    : new Color("#D6D6D6");
  oWidget.setPadding(10, 10, 10, 10);
  if (WIDGET_URL.length > 0) {
    oWidget.url = WIDGET_URL;
  }

  await addSmallWidgetData(oWidget);

  return oWidget;
}

/**
 * Creates medium sized widget.
 *
 * @return {ListWidget}
 */
async function createMediumWidget() {
  // Initialise widget
  const oWidget = new ListWidget();
  if (NO_BACKGROUND_INSTALLED && NO_BACKGROUND_ACTIVE) {
    oWidget.backgroundImage = await transparent(Script.name());
  } else {
    oWidget.backgroundColor = WIDGET_BACKGROUND;
  }
  oWidget.setPadding(10, 10, 10, 10);
  if (WIDGET_URL.length > 0) {
    oWidget.url = WIDGET_URL;
  }

  await addMediumWidgetData(oWidget);

  return oWidget;
}

/**
 * Add data to small sized widget.
 *
 * @param {ListWidget} oWidget
 */
async function addSmallWidgetData(oWidget) {
  const oGameData = await prepareData();

  if (oGameData != null) {
    let oMyTeam;
    let oOpponentTeam;
    if (oGameData.homeTeam.abbreviation == MY_NHL_TEAM) {
      oMyTeam = oGameData.homeTeam;
      oOpponentTeam = oGameData.awayTeam;
    } else {
      oOpponentTeam = oGameData.homeTeam;
      oMyTeam = oGameData.awayTeam;
    }

    const oUpperStack = oWidget.addStack();
    oUpperStack.layoutHorizontally();

    const oUpperTextStack = oUpperStack.addStack();
    oUpperTextStack.layoutVertically();

    const dGameDate = new Date(oGameData.gameDate);
    const dLocalDate = dGameDate.toLocaleString([], {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
    const oGameDateText = oUpperTextStack.addText(
      `${dLocalDate.split(",")[0]}`
    );
    oGameDateText.font = Font.boldSystemFont(11);
    oGameDateText.textColor = getColorForCurrentAppearance();

    if (!!dLocalDate.split(",")[1]) {
      const oGameTimeText = oUpperTextStack.addText(
        `${dLocalDate.split(",")[1].trim()}`
      );
      oGameTimeText.font = Font.boldSystemFont(11);
      oGameTimeText.textColor = getColorForCurrentAppearance();
    }

    if (oGameData.venue != "") {
      const oVenueText = oUpperTextStack.addText(`@ ${oGameData.venue}`);
      oVenueText.font = Font.boldSystemFont(11);
      oVenueText.textColor = getColorForCurrentAppearance();
    }

    oUpperStack.addSpacer();

    const oOpponentLogoImage = await loadLogo(
      oOpponentTeam.logoLink,
      oOpponentTeam.abbreviation
    );
    const oOpponentLogo = oUpperStack.addImage(oOpponentLogoImage);
    oOpponentLogo.imageSize = new Size(40, 40);

    if (SHOW_STATS_AND_STANDINGS) {
      oWidget.addSpacer(4);

      const oOpponentTeamStatsText = oWidget.addText(
        "W: " +
          oOpponentTeam.record.wins +
          " - L: " +
          oOpponentTeam.record.losses +
          " - OTL: " +
          oOpponentTeam.record.ot
      );
      oOpponentTeamStatsText.font = Font.systemFont(11);
      oOpponentTeamStatsText.textColor = getColorForCurrentAppearance();

      const oOpponentTeamStandingsText = oWidget.addText(
        "Div.: " +
          oOpponentTeam.record.divisionRank +
          "." +
          " | Lea.: " +
          oOpponentTeam.record.leagueRank +
          "."
      );
      oOpponentTeamStandingsText.font = Font.systemFont(11);
      oOpponentTeamStandingsText.textColor = getColorForCurrentAppearance();

      if (oOpponentTeam.topscorer.name != null) {
        const oOpponentTeamTopScorerText = oWidget.addText(
          `${oOpponentTeam.topscorer.name} (${oOpponentTeam.topscorer.points})`
        );
        oOpponentTeamTopScorerText.font = Font.systemFont(11);
        oOpponentTeamTopScorerText.textColor = getColorForCurrentAppearance();
      }
    }

    if (SHOW_STATS_AND_STANDINGS) {
      const oDivider = oWidget.addText(`___________________________`);
      oDivider.font = Font.boldSystemFont(6);
      oDivider.textColor = getColorForCurrentAppearance();

      oWidget.addSpacer(6);

      const oBottomStack = oWidget.addStack();
      oBottomStack.layoutHorizontally();

      const oBottomTextStack = oBottomStack.addStack();
      oBottomTextStack.layoutVertically();

      const oMyTeamStatsText = oBottomTextStack.addText(
        "W: " +
          oMyTeam.record.wins +
          " - L: " +
          oMyTeam.record.losses +
          " - OTL: " +
          oMyTeam.record.ot
      );
      oMyTeamStatsText.font = Font.systemFont(9);
      oMyTeamStatsText.textColor = getColorForCurrentAppearance();

      const oMyTeamStandingsText = oBottomTextStack.addText(
        "Div.: " +
          oMyTeam.record.divisionRank +
          "." +
          " | Lea.: " +
          oMyTeam.record.leagueRank +
          "."
      );
      oMyTeamStandingsText.font = Font.systemFont(9);
      oMyTeamStandingsText.textColor = getColorForCurrentAppearance();

      if (oMyTeam.topscorer.name != null) {
        const oMyTeamTopScorerText = oBottomTextStack.addText(
          `${oMyTeam.topscorer.name} (${oMyTeam.topscorer.points})`
        );
        oMyTeamTopScorerText.font = Font.systemFont(9);
        oMyTeamTopScorerText.textColor = getColorForCurrentAppearance();
      }

      oBottomStack.addSpacer();

      const oMyTeamLogoImage = await loadLogo(
        oMyTeam.logoLink,
        oMyTeam.abbreviation
      );
      const oMyTeamLogo = oBottomStack.addImage(oMyTeamLogoImage);
      oMyTeamLogo.imageSize = new Size(25, 25);
    }
  } else {
    const oHeadingText = oWidget.addText(`No upcoming games. Season ended.`);
    oHeadingText.font = Font.boldSystemFont(11);
    oHeadingText.textColor = getColorForCurrentAppearance();

    oWidget.addSpacer();
  }
}

/**
 * Add data to medium sized widget.
 *
 * @param {ListWidget} oWidget
 */
async function addMediumWidgetData(oWidget) {
  const oGameData = await prepareData();

  const oTopRow = oWidget.addStack();
  await setStackBackground(oTopRow);
  oTopRow.cornerRadius = 12;
  oTopRow.size = new Size(308, 15);
  oTopRow.setPadding(7, 7, 7, 7);
  oTopRow.layoutVertically();

  const oSpacerStack1 = oTopRow.addStack();
  oSpacerStack1.layoutHorizontally();
  oSpacerStack1.addSpacer();

  if (oGameData != null) {
    const oHeadingStack = oTopRow.addStack();
    oHeadingStack.layoutHorizontally();
    oHeadingStack.addSpacer();
    oHeadingStack.setPadding(7, 7, 7, 7);

    let oHeadingText;
    if (
      oGameData.currentPeriodOrdinal != undefined &&
      oGameData.currentPeriodOrdinal != null &&
      oGameData.currentPeriodOrdinal != "" &&
      SHOW_LIVE_SCORES
    ) {
      oHeadingText = oHeadingStack.addText(
        `${oGameData.currentPeriodOrdinal} - ${oGameData.timeRemaining}`
      );
    } else {
      const dGameDate = new Date(oGameData.gameDate);
      const dLocalDate = dGameDate.toLocaleString([], {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
      const sVenueText = oGameData.venue != "" ? ` @ ${oGameData.venue}` : ``;
      oHeadingText = oHeadingStack.addText(`${dLocalDate}${sVenueText}`);
    }
    oHeadingText.font = Font.boldSystemFont(11);
    oHeadingText.textColor = getColorForCurrentAppearance();

    oHeadingStack.addSpacer();

    const oSpacerStack2 = oTopRow.addStack();
    oSpacerStack2.layoutHorizontally();
    oSpacerStack2.addSpacer();

    oWidget.addSpacer();

    const oNextGameStack = oWidget.addStack();
    oNextGameStack.layoutHorizontally();
    oNextGameStack.cornerRadius = 12;

    if (SHOW_HOME_TEAM_FIRST) {
      await addHomeTeamStack(oNextGameStack, oGameData);
      oNextGameStack.addSpacer();
      await addAwayTeamStack(oNextGameStack, oGameData);
    } else {
      await addAwayTeamStack(oNextGameStack, oGameData);
      oNextGameStack.addSpacer();
      await addHomeTeamStack(oNextGameStack, oGameData);
    }
    oWidget.addSpacer();

    const oFutureGamesStack = oWidget.addStack();
    oFutureGamesStack.layoutHorizontally();
    oFutureGamesStack.centerAlignContent();
    await setStackBackground(oFutureGamesStack);
    oFutureGamesStack.cornerRadius = 12;
    oFutureGamesStack.setPadding(3, 7, 3, 7);
    oFutureGamesStack.addSpacer();
    oFutureGamesStack.size = new Size(308, 15);

    for (let i = 0; i < oGameData.nextGames.length; i++) {
      const oNextGame = oGameData.nextGames[i];

      const oFutureGame = oFutureGamesStack.addStack();
      oFutureGame.layoutHorizontally();
      oFutureGame.addSpacer();

      const oFutureGameLogoImage = await loadLogo(
        oNextGame.opponent.logoLink,
        oNextGame.opponent.abbreviation
      );
      const oNextGameLogo = oFutureGame.addImage(oFutureGameLogoImage);
      oNextGameLogo.imageSize = new Size(15, 15);

      const dGameDate = new Date(oNextGame.gameDate);
      const dLocalDate = dGameDate.toLocaleString([], {
        month: "2-digit",
        day: "2-digit",
      });
      const oNextGameText = oFutureGame.addText(` ${dLocalDate}`);
      oNextGameText.font = Font.systemFont(11);
      oNextGameText.textColor = getColorForCurrentAppearance();

      oFutureGame.addSpacer();
    }

    oFutureGamesStack.addSpacer();
  } else {
    const oHeadingStack = oTopRow.addStack();
    oHeadingStack.layoutHorizontally();
    oHeadingStack.addSpacer();
    oHeadingStack.setPadding(7, 7, 7, 7);

    const oHeadingText = oHeadingStack.addText(
      `No upcoming games. Season ended.`
    );
    oHeadingText.font = Font.boldSystemFont(11);
    oHeadingText.textColor = getColorForCurrentAppearance();

    oHeadingStack.addSpacer();

    const oSpacerStack2 = oTopRow.addStack();
    oSpacerStack2.layoutHorizontally();
    oSpacerStack2.addSpacer();

    oWidget.addSpacer();
  }
}

/**
 * Adds stack for home team to the medium sized widget.
 *
 * @param {Object} oNextGameStack
 * @param {Object} oGameData
 */
async function addHomeTeamStack(oNextGameStack, oGameData) {
  const oHomeTeamStack = oNextGameStack.addStack();
  oHomeTeamStack.layoutVertically();
  oHomeTeamStack.centerAlignContent();
  oHomeTeamStack.setPadding(7, 7, 7, 7);
  await setStackBackground(oHomeTeamStack);
  oHomeTeamStack.cornerRadius = 12;
  oHomeTeamStack.size = new Size(150, 0);

  const oHomeTeamLogoStack = oHomeTeamStack.addStack();
  oHomeTeamLogoStack.layoutHorizontally();

  const oHomeLogoImage = await loadLogo(
    oGameData.homeTeam.logoLink,
    oGameData.homeTeam.abbreviation
  );
  const oHomeLogo = oHomeTeamLogoStack.addImage(oHomeLogoImage);
  oHomeLogo.imageSize = new Size(40, 40);

  if (SHOW_LIVE_SCORES) {
    oHomeTeamLogoStack.addSpacer(45);
    const oHomeTeamGoalsText = oHomeTeamLogoStack.addText(
      oGameData.currentPeriod === 0 ? `-` : `${oGameData.homeTeam.goals}`
    );
    oHomeTeamGoalsText.font = Font.boldSystemFont(35);
    oHomeTeamGoalsText.textColor = getColorForCurrentAppearance();
  }

  if (SHOW_STATS_AND_STANDINGS) {
    const oHomeTeamStatsText = oHomeTeamStack.addText(
      "W: " +
        oGameData.homeTeam.record.wins +
        " - L: " +
        oGameData.homeTeam.record.losses +
        " - OTL: " +
        oGameData.homeTeam.record.ot
    );
    oHomeTeamStatsText.font = Font.systemFont(11);
    oHomeTeamStatsText.textColor = getColorForCurrentAppearance();

    const oHomeTeamStandingsText = oHomeTeamStack.addText(
      "Division: " +
        oGameData.homeTeam.record.divisionRank +
        "." +
        " | League: " +
        oGameData.homeTeam.record.leagueRank +
        "."
    );
    oHomeTeamStandingsText.font = Font.systemFont(9);
    oHomeTeamStandingsText.textColor = getColorForCurrentAppearance();

    if (oGameData.homeTeam.topscorer.name != null) {
      const oHomeTeamTopScorerText = oHomeTeamStack.addText(
        `${oGameData.homeTeam.topscorer.name} (${oGameData.homeTeam.topscorer.points})`
      );
      oHomeTeamTopScorerText.centerAlignText();
      oHomeTeamTopScorerText.font = Font.systemFont(9);
      oHomeTeamTopScorerText.textColor = getColorForCurrentAppearance();
    }
  }
}

/**
 * Adds stack for away team to the medium sized widget.
 *
 * @param {Object} oNextGameStack
 * @param {Object} oGameData
 */
async function addAwayTeamStack(oNextGameStack, oGameData) {
  const oAwayTeamStack = oNextGameStack.addStack();
  oAwayTeamStack.layoutVertically();
  oAwayTeamStack.centerAlignContent();
  oAwayTeamStack.setPadding(7, 7, 7, 7);
  await setStackBackground(oAwayTeamStack);
  oAwayTeamStack.cornerRadius = 12;
  oAwayTeamStack.size = new Size(150, 0);

  const oAwayTeamLogoStack = oAwayTeamStack.addStack();
  oAwayTeamLogoStack.layoutHorizontally();

  const oAwayLogoImage = await loadLogo(
    oGameData.awayTeam.logoLink,
    oGameData.awayTeam.abbreviation
  );
  const oAwayLogo = oAwayTeamLogoStack.addImage(oAwayLogoImage);
  oAwayLogo.imageSize = new Size(40, 40);

  if (SHOW_LIVE_SCORES) {
    oAwayTeamLogoStack.addSpacer(45);

    const oAwayTeamGoalsText = oAwayTeamLogoStack.addText(
      oGameData.currentPeriod === 0 ? `-` : `${oGameData.awayTeam.goals}`
    );
    oAwayTeamGoalsText.font = Font.boldSystemFont(35);
    oAwayTeamGoalsText.textColor = getColorForCurrentAppearance();
  }

  if (SHOW_STATS_AND_STANDINGS) {
    const oAwayTeamStatsText = oAwayTeamStack.addText(
      "W: " +
        oGameData.awayTeam.record.wins +
        " - L: " +
        oGameData.awayTeam.record.losses +
        " - OTL: " +
        oGameData.awayTeam.record.ot
    );
    oAwayTeamStatsText.font = Font.systemFont(11);
    oAwayTeamStatsText.textColor = getColorForCurrentAppearance();

    const oAwayTeamStandingsText = oAwayTeamStack.addText(
      "Division: " +
        oGameData.awayTeam.record.divisionRank +
        "." +
        " | League: " +
        oGameData.awayTeam.record.leagueRank +
        "."
    );
    oAwayTeamStandingsText.font = Font.systemFont(9);
    oAwayTeamStandingsText.textColor = getColorForCurrentAppearance();

    if (oGameData.awayTeam.topscorer.name != null) {
      const oAwayTeamTopScorerText = oAwayTeamStack.addText(
        `${oGameData.awayTeam.topscorer.name} (${oGameData.awayTeam.topscorer.points})`
      );
      oAwayTeamTopScorerText.font = Font.systemFont(9);
      oAwayTeamTopScorerText.textColor = getColorForCurrentAppearance();
    }
  }
}

/**
 * Prepares data.
 *
 * @return {Object[]}
 */
async function prepareData() {
  const oData = {
    gameDate: "",
    venue: "",
    currentPeriod: 0,
    currentPeriodOrdinal: "",
    timeRemaining: "",
    nextGames: [],
    homeTeam: {
      abbreviation: "",
      logoLink: "",
      record: {},
      goals: "",
      topscorer: {
        name: null,
        points: "",
      },
    },
    awayTeam: {
      abbreviation: "",
      logoLink: "",
      record: {},
      goals: "",
      topscorer: {
        name: null,
        points: "",
      },
    },
  };

  const oTeamData = getTeamData();
  const oScheduleData = await fetchScheduleData(oTeamData);
  const oStandings = await fetchCurrentStandings();

  if (
    oScheduleData &&
    oScheduleData.dates.length > 0 &&
    oScheduleData.dates[0].games.length > 0
  ) {
    const oNextGame = oScheduleData.dates[0].games[0];

    if (oNextGame != undefined) {
      const oHomeTeam = oNextGame.teams.home;
      const oAwayTeam = oNextGame.teams.away;

      const oHomeTeamTopScorer = await fetchTopScorer(oHomeTeam.team.id);
      const oAwayTeamTopScorer = await fetchTopScorer(oAwayTeam.team.id);

      const oHomeTeamStandings = filterStandingsById(
        oHomeTeam.team.id,
        oStandings
      );
      const oAwayTeamStandings = filterStandingsById(
        oAwayTeam.team.id,
        oStandings
      );

      oData.gameDate = oNextGame.gameDate;
      if (oNextGame.venue) {
        oData.venue = oNextGame.venue.city
          ? oNextGame.venue.city
          : oNextGame.venue.location.city;
      }
      oData.nextGames = getNextGames(oScheduleData.dates, oTeamData);
      oData.homeTeam.abbreviation = oHomeTeam.team.abbreviation;
      oData.homeTeam.logoLink = oTeamData[oData.homeTeam.abbreviation].logo;
      oData.homeTeam.record = oHomeTeamStandings;
      oData.awayTeam.abbreviation = oAwayTeam.team.abbreviation;
      oData.awayTeam.logoLink = oTeamData[oData.awayTeam.abbreviation].logo;
      oData.awayTeam.record = oAwayTeamStandings;

      if (oHomeTeamTopScorer != null) {
        oData.homeTeam.topscorer.name = oHomeTeamTopScorer.person.fullName;
        oData.homeTeam.topscorer.points = oHomeTeamTopScorer.value;
      }
      if (oAwayTeamTopScorer != null) {
        oData.awayTeam.topscorer.name = oAwayTeamTopScorer.person.fullName;
        oData.awayTeam.topscorer.points = oAwayTeamTopScorer.value;
      }

      if (SHOW_LIVE_SCORES) {
        const oLiveData = await fetchLiveData(oNextGame.gamePk);
        if (oLiveData) {
          const oLineScore = oLiveData["linescore"];
          const bIsShootout = oLineScore.hasShootout;
          if (oLineScore) {
            oData.currentPeriod = oLineScore.currentPeriod;
            oData.currentPeriodOrdinal = oLineScore.currentPeriodOrdinal;
            oData.timeRemaining = oLineScore.currentPeriodTimeRemaining;
          }

          const oBoxScoreTeams = oLiveData.boxscore.teams;
          if (
            oBoxScoreTeams.home.teamStats.teamSkaterStats !== undefined &&
            oBoxScoreTeams.home.teamStats.teamSkaterStats.goals !== undefined
          ) {
            oData.homeTeam.goals =
              oBoxScoreTeams.home.teamStats.teamSkaterStats.goals;
            if (bIsShootout) {
              oData.homeTeam.goals =
                oLineScore.shootoutInfo.home.scores + oData.homeTeam.goals;
            }
          }

          if (
            oBoxScoreTeams.away.teamStats.teamSkaterStats !== undefined &&
            oBoxScoreTeams.away.teamStats.teamSkaterStats.goals !== undefined
          ) {
            oData.awayTeam.goals =
              oBoxScoreTeams.away.teamStats.teamSkaterStats.goals;
            if (bIsShootout) {
              oData.awayTeam.goals =
                oLineScore.shootoutInfo.away.scores + oData.awayTeam.goals;
            }
          }
        }
      }
    }
  } else {
    return null;
  }

  return oData;
}

/**
 * Returns next games.
 *
 * @param {Object[]} aGames
 * @param {Object} oTeamData
 * @return {Object[]}
 */
function getNextGames(aGames, oTeamData) {
  const sMyTeamId = oTeamData[MY_NHL_TEAM].id;
  const aNextGames = [];
  const iLength = aGames.length < 5 ? aGames.length : 5;

  for (let i = 1; i < iLength; i++) {
    let oData = {
      gameDate: "",
      opponent: {
        abbreviation: "",
        logoLink: "",
      },
    };

    const oGame = aGames[i].games[0];
    oData.gameDate = oGame.gameDate;
    if (oGame.teams.away.team.id == sMyTeamId) {
      oData.opponent.abbreviation = oGame.teams.home.team.abbreviation;
    } else {
      // Yeey, it's a homegame for my team :-)
      oData.opponent.abbreviation = oGame.teams.away.team.abbreviation;
    }
    oData.opponent.logoLink = oTeamData[oData.opponent.abbreviation].logo;

    aNextGames.push(oData);
  }

  return aNextGames;
}

/**
 * Filters standings by team id.
 *
 * @param {String} sTeamId
 * @param {Object} oStandings
 * @return {Object}
 */
function filterStandingsById(sTeamId, oStandings) {
  let oResult = null;
  if (oStandings) {
    oStandings.records.forEach((record) => {
      record.teamRecords.forEach((teamRecord) => {
        if (teamRecord.team.id == sTeamId) {
          oResult = {
            wins: teamRecord.leagueRecord.wins,
            losses: teamRecord.leagueRecord.losses,
            ot: teamRecord.leagueRecord.ot,
            divisionRank: teamRecord.divisionRank,
            leagueRank: teamRecord.leagueRank,
          };
        }
        if (oResult != null) {
          return oResult;
        }
      });

      if (oResult != null) {
        return oResult;
      }
    });
  }

  if (oResult === null) {
    oResult = {
      wins: 0,
      losses: 0,
      ot: 0,
      divisionRank: 0,
      leagueRank: 0,
    };
  }

  return oResult;
}

/**
 * Fetches schedule data from NHL api.
 *
 * @param {Object} oTeamData
 * @return {Object}
 */
async function fetchScheduleData(oTeamData) {
  const sMyTeamId = oTeamData[MY_NHL_TEAM].id;
  const dStartDate = new Date();

  // Games in Europe are after midnight, so subtract 6 hours
  dStartDate.setHours(dStartDate.getHours() - 6);

  const iYear = dStartDate.getFullYear();
  const iMonth = dStartDate.getMonth() + 1;
  const iDay = dStartDate.getDate();
  const sFormattedDate = iYear + "-" + iMonth + "-" + iDay;
  const sUrl = `https://statsapi.web.nhl.com/api/v1/schedule?startDate=${sFormattedDate}&endDate=2021-12-30&teamId=${sMyTeamId}&expand=schedule.teams,schedule.venue,schedule.metadata,schedule.ticket,schedule.broadcasts.all`;
  const oRequest = new Request(sUrl);
  return await oRequest.loadJSON();
}

/**
 * Fetches top scorer data from NHL api.
 *
 * @param {string} sTeamId
 * @return {Object}
 */
async function fetchTopScorer(sTeamId) {
  const sUrl = `https://statsapi.web.nhl.com/api/v1/teams/${sTeamId}?expand=team.leaders,leaders.person&leaderGameTypes=R&leaderCategories=points`;
  const oRequest = new Request(sUrl);
  const oTopScorer = await oRequest.loadJSON();

  let oResult = null;
  if (oTopScorer !== undefined) {
    if (oTopScorer.teams[0] !== undefined) {
      if (oTopScorer.teams[0].teamLeaders !== undefined) {
        oResult = oTopScorer.teams[0].teamLeaders[0].leaders[0];
        if (!oResult) {
          oResult = null;
        }
      }
    }
  }

  return oResult;
}

/**
 * Fetches live standings data from NHL api.
 *
 * @param {string} sGameId
 * @return {Object}
 */
async function fetchLiveData(sGameId) {
  const sUrl = `https://statsapi.web.nhl.com/api/v1/game/${sGameId}/feed/live`;
  const oRequest = new Request(sUrl);
  const oLiveData = await oRequest.loadJSON();

  let oResult = null;
  if (oLiveData !== undefined) {
    if (oLiveData.liveData !== undefined) {
      oResult = oLiveData.liveData;
      if (!oResult) {
        oResult = null;
      }
    }
  }

  return oResult;
}

/**
 * Fetches conference and league standings data from NHL api.
 *
 * @return {Object}
 */
async function fetchCurrentStandings() {
  const sUrl = `https://statsapi.web.nhl.com/api/v1/standings`;
  const oRequest = new Request(sUrl);
  return await oRequest.loadJSON();
}

/**
 * Loads image from thesportsdb.com or from local cache.
 *
 * @param {String} sImageUrl
 * @param {String} sTeamAbbreviation
 * @return {Object}
 */
async function loadLogo(sImageUrl, sTeamAbbreviation) {
  // Set up the file manager.
  const oFiles = FileManager.local();

  // Set up cache
  const sCachePath = oFiles.joinPath(
    oFiles.cacheDirectory(),
    sTeamAbbreviation + "_NHL"
  );
  const bCacheExists = oFiles.fileExists(sCachePath);

  let oResult;
  try {
    if (bCacheExists) {
      oResult = oFiles.readImage(sCachePath);
    } else {
      const oRequest = new Request(sImageUrl);
      oResult = await oRequest.loadImage();
      try {
        oFiles.writeImage(sCachePath, oResult);
        console.log("Created cache entry for logo of " + sTeamAbbreviation);
      } catch (e) {
        console.log(e);
      }
    }
  } catch (oError) {
    console.error(oError);
    if (bCacheExists) {
      oResult = oFiles.readImage(sCachePath);
    } else {
      console.log("Fetching logo for " + sTeamAbbreviation + " failed.");
    }
  }

  return oResult;
}

/**
 * Sets background for stack.
 *
 * @param {String} oStack
 */
async function setStackBackground(oStack) {
  if (
    NO_BACKGROUND_INSTALLED &&
    NO_BACKGROUND_ACTIVE &&
    NO_BACKGROUND_FULL_ACTIVE
  ) {
    oStack.backgroundImage = await transparent(Script.name());
  } else {
    oStack.backgroundColor = STACK_BACKGROUND;
  }
}

/**
 * Returns color object depending if dark mode is active or not.
 *
 * @return {Object}
 */
function getColorForCurrentAppearance() {
  return DARK_MODE ? Color.white() : Color.black();
}

/**
 * Placeholder function when no-background.js isn't installed.
 *
 * @return {Object}
 */
function emptyFunction() {
  // Silence
  return {};
}

/**
 * Returns static team data.
 *
 * @return {Object}
 */
function getTeamData() {
  return {
    // New Jersey Devils
    NJD: {
      id: "1",
      logo:
        "https://www.thesportsdb.com/images/media/team/badge/ssppey1547160174.png/preview",
    },
    // New York Islanders
    NYI: {
      id: "2",
      logo:
        "https://www.thesportsdb.com/images/media/team/badge/kj8uh41546001378.png/preview",
    },
    // New York Rangers
    NYR: {
      id: "3",
      logo:
        "https://www.thesportsdb.com/images/media/team/badge/bez4251546192693.png/preview",
    },
    // Philadelphia Flyers
    PHI: {
      id: "4",
      logo:
        "https://www.thesportsdb.com/images/media/team/badge/qxxppp1421794965.png/preview",
    },
    // Pittsburgh Penguins
    PIT: {
      id: "5",
      logo:
        "https://www.thesportsdb.com/images/media/team/badge/dsj3on1546192477.png/preview",
    },
    // Boston Bruins
    BOS: {
      id: "6",
      logo:
        "https://www.thesportsdb.com/images/media/team/badge/vuspuq1421791546.png/preview",
    },
    // Buffalo Sabres
    BUF: {
      id: "7",
      logo: "https://i.imgur.com/RC2srC9.png",
    },
    // Montréal Canadiens
    MTL: {
      id: "8",
      logo:
        "https://www.thesportsdb.com/images/media/team/badge/stpryx1421791753.png/preview",
    },
    // Ottawa Senators
    OTT: {
      id: "9",
      logo:
        "https://www.thesportsdb.com/images/media/team/badge/qurpwu1421616521.png/preview",
    },
    // Toronto Maple Leafs
    TOR: {
      id: "10",
      logo:
        "https://www.thesportsdb.com/images/media/team/badge/mxig4p1570129307.png/preview",
    },
    // Carolina Hurricanes
    CAR: {
      id: "12",
      logo:
        "https://www.thesportsdb.com/images/media/team/badge/v07m3x1547232585.png/preview",
    },
    // Florida Panthers
    FLA: {
      id: "13",
      logo:
        "https://www.thesportsdb.com/images/media/team/badge/8qtaz11547158220.png/preview",
    },
    // Tampa Bay Lightning
    TBL: {
      id: "14",
      logo:
        "https://www.thesportsdb.com/images/media/team/badge/swysut1421791822.png/preview",
    },
    // Washington Capitals
    WSH: {
      id: "15",
      logo:
        "https://www.thesportsdb.com/images/media/team/badge/u17iel1547157581.png/preview",
    },
    // Chicago Blackhawks
    CHI: {
      id: "16",
      logo:
        "https://www.thesportsdb.com/images/media/team/badge/tuwyvr1422041801.png/preview",
    },
    // Detroit Red Wings
    DET: {
      id: "17",
      logo:
        "https://www.thesportsdb.com/images/media/team/badge/1c24ow1546544080.png/preview",
    },
    // Nashville Predators
    NSH: {
      id: "18",
      logo:
        "https://www.thesportsdb.com/images/media/team/badge/twqyvy1422052908.png/preview",
    },
    // St. Louis Blues
    STL: {
      id: "19",
      logo:
        "https://www.thesportsdb.com/images/media/team/badge/rsqtwx1422053715.png/preview",
    },
    // Calgary Flames
    CGY: {
      id: "20",
      logo:
        "https://www.thesportsdb.com/images/media/team/badge/yqptxx1421869532.png/preview",
    },
    // Colorado Avalanche
    COL: {
      id: "21",
      logo:
        "https://www.thesportsdb.com/images/media/team/badge/wqutut1421173572.png/preview",
    },
    // Edmonton Oilers
    EDM: {
      id: "22",
      logo:
        "https://www.thesportsdb.com/images/media/team/badge/uxxsyw1421618428.png/preview",
    },
    // Vancouver Canucks
    VAN: {
      id: "23",
      logo:
        "https://www.thesportsdb.com/images/media/team/badge/xqxxpw1421875519.png/preview",
    },
    // Anaheim Ducks
    ANA: {
      id: "24",
      logo:
        "https://www.thesportsdb.com/images/media/team/badge/6g9t721547289240.png/preview",
    },
    // Dallas Stars
    DAL: {
      id: "25",
      logo:
        "https://www.thesportsdb.com/images/media/team/badge/qrvywq1422042125.png/preview",
    },
    // Los Angeles Kings
    LAK: {
      id: "26",
      logo:
        "https://www.thesportsdb.com/images/media/team/badge/uvwtvx1421535024.png/preview",
    },
    // San Jose Sharks
    SJS: {
      id: "28",
      logo:
        "https://www.thesportsdb.com/images/media/team/badge/yui7871546193006.png/preview",
    },
    // Columbus Blue Jackets
    CBJ: {
      id: "29",
      logo:
        "https://www.thesportsdb.com/images/media/team/badge/ssytwt1421792535.png/preview",
    },
    // Minnesota Wild
    MIN: {
      id: "30",
      logo:
        "https://www.thesportsdb.com/images/media/team/badge/swtsxs1422042685.png/preview",
    },
    // Winnipeg Jets
    WPG: {
      id: "52",
      logo:
        "https://www.thesportsdb.com/images/media/team/badge/bwn9hr1547233611.png/preview",
    },
    // Arizona Coyotes
    ARI: {
      id: "53",
      logo:
        "https://www.thesportsdb.com/images/media/team/badge/wpxpsx1421868857.png/preview",
    },
    // Vegas Golden Knights
    VGK: {
      id: "54",
      logo:
        "https://www.thesportsdb.com/images/media/team/badge/9w7peh1507632324.png/preview",
    },
  };
}

/**
 * Creates large sized widget.
 *
 * @return {ListWidget}
 */
async function createLargeWidget() {
  // Initialise widget
  const oWidget = new ListWidget();
  oWidget.setPadding(10, 10, 10, 10);
  oWidget.url =
    "https://github.com/thisisevanfox/nhl-my-team-ios-widget/blob/main/Installation%20guide.md";

  const oHeadingStack = oWidget.addStack();
  oHeadingStack.layoutVertically();
  oHeadingStack.setPadding(7, 7, 7, 7);

  const oHeadingText = oHeadingStack.addText(
    `Currently a large widget is not supported. Only small and medium size widgets are possible. Don't know how to get it? Click the widget to read to the installation instructions.`
  );
  oHeadingText.font = Font.systemFont(16);
  oHeadingText.textColor = Color.red();

  return oWidget;
}

/********************************************************
 ************* MAKE SURE TO COPY EVERYTHING *************
 *******************************************************/
