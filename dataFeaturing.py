import requests
import csv
import pandas


def data_extraction(league, variable, graph_type, x_axis_variable, y_axis_variable):
    
    print("Before reading csv")
    data = read_csv()
    print("After reading csv")
    
    sum_goals_premier_league = 0
    sum_goals_serie_a = 0
    sum_goals_la_liga = 0
    sum_goals_bundesliga = 0
    sum_goals_ligue_1 = 0

    sum_age_la_liga = 0
    sum_age_serie_a = 0
    sum_age_premier_league = 0
    sum_age_bundesliga = 0
    sum_age_ligue_1 = 0

    sum_player_count_la_liga = 0
    sum_player_count_serie_a = 0
    sum_player_count_premier_league = 0
    sum_player_count_bundesliga = 0
    sum_player_count_ligue_1 = 0

    sum_passes_la_liga = 0
    sum_passes_serie_a = 0
    sum_passes_premier_league = 0
    sum_passes_bundesliga = 0
    sum_passes_ligue_1 = 0

    sum_fouls_la_liga = 0
    sum_fouls_serie_a = 0
    sum_fouls_premier_league = 0
    sum_fouls_bundesliga = 0
    sum_fouls_ligue_1 = 0

    teams_premier_league = {}
    teams_ligue_1 = {}
    teams_bundesliga = {}
    teams_serie_a = {}
    teams_la_liga = {}

    la_liga_bin = {
        "0-20": {"goals": 0, "player_count": 0, "suc_pass": 0, "fouls": 0},
        "21-25": {"goals": 0, "player_count": 0, "suc_pass": 0, "fouls": 0},
        "26-30": {"goals": 0, "player_count": 0, "suc_pass": 0, "fouls": 0},
        "31-35": {"goals": 0, "player_count": 0, "suc_pass": 0, "fouls": 0},
        "35-40": {"goals": 0, "player_count": 0, "suc_pass": 0, "fouls": 0},
        "40+": {"goals": 0, "player_count": 0, "suc_pass": 0, "fouls": 0}
    }

    serie_a_bin = {
        "0-20": {"goals": 0, "player_count": 0, "suc_pass": 0, "fouls": 0},
        "21-25": {"goals": 0, "player_count": 0, "suc_pass": 0, "fouls": 0},
        "26-30": {"goals": 0, "player_count": 0, "suc_pass": 0, "fouls": 0},
        "31-35": {"goals": 0, "player_count": 0, "suc_pass": 0, "fouls": 0},
        "35-40": {"goals": 0, "player_count": 0, "suc_pass": 0, "fouls": 0},
        "40+": {"goals": 0, "player_count": 0, "suc_pass": 0, "fouls": 0}
    }

    bundesliga_bin = {
        "0-20": {"goals": 0, "player_count": 0, "suc_pass": 0, "fouls": 0},
        "21-25": {"goals": 0, "player_count": 0, "suc_pass": 0, "fouls": 0},
        "26-30": {"goals": 0, "player_count": 0, "suc_pass": 0, "fouls": 0},
        "31-35": {"goals": 0, "player_count": 0, "suc_pass": 0, "fouls": 0},
        "35-40": {"goals": 0, "player_count": 0, "suc_pass": 0, "fouls": 0},
        "40+": {"goals": 0, "player_count": 0, "suc_pass": 0, "fouls": 0}
    }

    ligue_1_bin = {
        "0-20": {"goals": 0, "player_count": 0, "suc_pass": 0, "fouls": 0},
        "21-25": {"goals": 0, "player_count": 0, "suc_pass": 0, "fouls": 0},
        "26-30": {"goals": 0, "player_count": 0, "suc_pass": 0, "fouls": 0},
        "31-35": {"goals": 0, "player_count": 0, "suc_pass": 0, "fouls": 0},
        "35-40": {"goals": 0, "player_count": 0, "suc_pass": 0, "fouls": 0},
        "40+": {"goals": 0, "player_count": 0, "suc_pass": 0, "fouls": 0}
    }

    premier_league_bin = {
        "0-20": {"goals": 0, "player_count": 0, "suc_pass": 0, "fouls": 0},
        "21-25": {"goals": 0, "player_count": 0, "suc_pass": 0, "fouls": 0},
        "26-30": {"goals": 0, "player_count": 0, "suc_pass": 0, "fouls": 0},
        "31-35": {"goals": 0, "player_count": 0, "suc_pass": 0, "fouls": 0},
        "35-40": {"goals": 0, "player_count": 0, "suc_pass": 0, "fouls": 0},
        "40+": {"goals": 0, "player_count": 0, "suc_pass": 0, "fouls": 0}
    }

    age_grp = None

    for i in range(len(data)):
        # Check if the competition is "La Liga"

        if int(data[i]['Age']) < 20:
            age_grp = "0-20"
        elif 21 <= int(data[i]['Age']) <= 25:
            age_grp = "21-25"
        elif 26 <= int(data[i]['Age']) <= 30:
            age_grp = "26-30"
        elif 31 <= int(data[i]['Age']) <= 35:
            age_grp = "31-35"
        elif 36 <= int(data[i]['Age']) <= 40:
            age_grp = "35-40"
        elif int(data[i]['Age']) >= 41:
            age_grp = "40+"

        if data[i]['Comp'] == "La Liga":
            # Sum up the GoalsScored
            sum_goals_la_liga += int(data[i]['GoalsScored'])
            sum_age_la_liga += float(data[i]['Age'])
            sum_player_count_la_liga += 1
            sum_passes_la_liga += int(data[i]['TotalSuccessPasses'])
            sum_fouls_la_liga += int(data[i]['FoulsCommitted'])

            # Update total goals for the team in TeamsLaLiga dictionary
            if data[i]['Squad'] not in teams_la_liga:
                teams_la_liga[data[i]['Squad']] = {'goals': 0,'total_age': 0,'player_count': 0,'avg_age': 0,'suc_pass': 0,'fouls': 0}

            teams_la_liga[data[i]['Squad']]['goals'] += int(data[i]['GoalsScored'])
            teams_la_liga[data[i]['Squad']]['total_age'] += float(data[i]['Age'])
            teams_la_liga[data[i]['Squad']]['player_count'] += 1
            teams_la_liga[data[i]['Squad']]['avg_age'] = teams_la_liga[data[i]['Squad']]['total_age'] / teams_la_liga[data[i]['Squad']]['player_count']
            teams_la_liga[data[i]['Squad']]['suc_pass'] += int(data[i]['TotalSuccessPasses'])
            teams_la_liga[data[i]['Squad']]['fouls'] += int(data[i]['FoulsCommitted'])

            la_liga_bin[age_grp]['player_count'] += 1
            la_liga_bin[age_grp]['goals'] += int(data[i]['GoalsScored'])
            la_liga_bin[age_grp]['suc_pass'] += int(data[i]['TotalSuccessPasses'])
            la_liga_bin[age_grp]['fouls'] += int(data[i]['FoulsCommitted'])

        # Repeat the same pattern for other leagues
        elif data[i]['Comp'] == "Premier League":
            sum_goals_premier_league += int(data[i]['GoalsScored'])
            sum_age_premier_league += float(data[i]['Age'])
            sum_player_count_premier_league += 1
            sum_passes_premier_league += int(data[i]['TotalSuccessPasses'])
            sum_fouls_premier_league += int(data[i]['FoulsCommitted'])

            if data[i]['Squad'] not in teams_premier_league:
                teams_premier_league[data[i]['Squad']] = {'goals': 0,'total_age': 0,'player_count': 0,'avg_age': 0,'suc_pass': 0,'fouls': 0}

            teams_premier_league[data[i]['Squad']]['goals'] += int(data[i]['GoalsScored'])
            teams_premier_league[data[i]['Squad']]['total_age'] += float(data[i]['Age'])
            teams_premier_league[data[i]['Squad']]['player_count'] += 1
            teams_premier_league[data[i]['Squad']]['avg_age'] = teams_premier_league[data[i]['Squad']]['total_age'] / teams_premier_league[data[i]['Squad']]['player_count']
            teams_premier_league[data[i]['Squad']]['suc_pass'] += int(data[i]['TotalSuccessPasses'])
            teams_premier_league[data[i]['Squad']]['fouls'] += int(data[i]['FoulsCommitted'])

            premier_league_bin[age_grp]['player_count'] += 1
            premier_league_bin[age_grp]['goals'] += int(data[i]['GoalsScored'])
            premier_league_bin[age_grp]['suc_pass'] += int(data[i]['TotalSuccessPasses'])
            premier_league_bin[age_grp]['fouls'] += int(data[i]['FoulsCommitted'])

        elif data[i]['Comp'] == "Ligue 1":
            sum_goals_ligue_1 += int(data[i]['GoalsScored'])
            sum_age_ligue_1 += float(data[i]['Age'])
            sum_player_count_ligue_1 += 1
            sum_passes_ligue_1 += int(data[i]['TotalSuccessPasses'])
            sum_fouls_ligue_1 += int(data[i]['FoulsCommitted'])

            if data[i]['Squad'] not in teams_ligue_1:
                teams_ligue_1[data[i]['Squad']] = {'goals': 0,'total_age': 0,'player_count': 0,'avg_age': 0,'suc_pass': 0,'fouls': 0}

            teams_ligue_1[data[i]['Squad']]['goals'] += int(data[i]['GoalsScored'])
            teams_ligue_1[data[i]['Squad']]['total_age'] += float(data[i]['Age'])
            teams_ligue_1[data[i]['Squad']]['player_count'] += 1
            teams_ligue_1[data[i]['Squad']]['avg_age'] = teams_ligue_1[data[i]['Squad']]['total_age'] / teams_ligue_1[data[i]['Squad']]['player_count']
            teams_ligue_1[data[i]['Squad']]['suc_pass'] += int(data[i]['TotalSuccessPasses'])
            teams_ligue_1[data[i]['Squad']]['fouls'] += int(data[i]['FoulsCommitted'])

            ligue_1_bin[age_grp]['player_count'] += 1
            ligue_1_bin[age_grp]['goals'] += int(data[i]['GoalsScored'])
            ligue_1_bin[age_grp]['suc_pass'] += int(data[i]['TotalSuccessPasses'])
            ligue_1_bin[age_grp]['fouls'] += int(data[i]['FoulsCommitted'])

        elif data[i]['Comp'] == "Serie A":
            sum_goals_serie_a += int(data[i]['GoalsScored'])
            sum_age_serie_a += float(data[i]['Age'])
            sum_player_count_serie_a += 1
            sum_passes_serie_a += int(data[i]['TotalSuccessPasses'])
            sum_fouls_serie_a += int(data[i]['FoulsCommitted'])

            if data[i]['Squad'] not in teams_serie_a:
                teams_serie_a[data[i]['Squad']] = {'goals': 0,'total_age': 0,'player_count': 0,'avg_age': 0,'suc_pass': 0,'fouls': 0}

            teams_serie_a[data[i]['Squad']]['goals'] += int(data[i]['GoalsScored'])
            teams_serie_a[data[i]['Squad']]['total_age'] += float(data[i]['Age'])
            teams_serie_a[data[i]['Squad']]['player_count'] += 1
            teams_serie_a[data[i]['Squad']]['avg_age'] = teams_serie_a[data[i]['Squad']]['total_age'] / teams_serie_a[data[i]['Squad']]['player_count']
            teams_serie_a[data[i]['Squad']]['suc_pass'] += int(data[i]['TotalSuccessPasses'])
            teams_serie_a[data[i]['Squad']]['fouls'] += int(data[i]['FoulsCommitted'])

            serie_a_bin[age_grp]['player_count'] += 1
            serie_a_bin[age_grp]['goals'] += int(data[i]['GoalsScored'])
            serie_a_bin[age_grp]['suc_pass'] += int(data[i]['TotalSuccessPasses'])
            serie_a_bin[age_grp]['fouls'] += int(data[i]['FoulsCommitted'])

        elif data[i]['Comp'] == "Bundesliga":
            sum_goals_bundesliga += int(data[i]['GoalsScored'])
            sum_age_bundesliga += float(data[i]['Age'])
            sum_player_count_bundesliga += 1
            sum_passes_bundesliga += int(data[i]['TotalSuccessPasses'])
            sum_fouls_bundesliga += int(data[i]['FoulsCommitted'])

            if data[i]['Squad'] not in teams_bundesliga:
                teams_bundesliga[data[i]['Squad']] = {'goals': 0,'total_age': 0,'player_count': 0,'avg_age': 0,'suc_pass': 0,'fouls': 0}

            teams_bundesliga[data[i]['Squad']]['goals'] += int(data[i]['GoalsScored'])
            teams_bundesliga[data[i]['Squad']]['total_age'] += float(data[i]['Age'])
            teams_bundesliga[data[i]['Squad']]['player_count'] += 1
            teams_bundesliga[data[i]['Squad']]['avg_age'] = teams_bundesliga[data[i]['Squad']]['total_age'] / \
                teams_bundesliga[data[i]['Squad']]['player_count']
            teams_bundesliga[data[i]['Squad']]['suc_pass'] += int(data[i]['TotalSuccessPasses'])
            teams_bundesliga[data[i]['Squad']]['fouls'] += int(data[i]['FoulsCommitted'])

            bundesliga_bin[age_grp]['player_count'] += 1
            bundesliga_bin[age_grp]['goals'] += int(data[i]['GoalsScored'])
            bundesliga_bin[age_grp]['suc_pass'] += int(data[i]['TotalSuccessPasses'])
            bundesliga_bin[age_grp]['fouls'] += int(data[i]['FoulsCommitted'])


    totalGoals = [sum_goals_premier_league, sum_goals_ligue_1, sum_goals_bundesliga, sum_goals_serie_a, sum_goals_la_liga]
    LeagueAvgAge = [sum_age_premier_league/sum_player_count_premier_league, sum_age_ligue_1/sum_player_count_ligue_1, sum_age_bundesliga/sum_player_count_bundesliga, sum_age_serie_a/sum_player_count_serie_a, sum_age_la_liga/sum_player_count_la_liga]
    LeaguePasses = [sum_passes_premier_league, sum_passes_ligue_1, sum_passes_bundesliga, sum_passes_serie_a, sum_passes_la_liga]
    LeagueFouls = [sum_fouls_premier_league, sum_fouls_ligue_1, sum_fouls_bundesliga, sum_fouls_serie_a, sum_fouls_la_liga]
    leagues = ["Premier League", "Ligue 1", "Bundesliga", "Serie A", "La Liga"]
    allTeamsStats = [{"Premier League":teams_premier_league},{"Ligue 1":teams_ligue_1},{"Bundesliga":teams_bundesliga},{"Serie A":teams_serie_a},{"La Liga":teams_la_liga}]


    # Flatten the array to get an array of all goals
    all_goals = [goals for league in allTeamsStats for teams_and_goals in league.values() for goals in teams_and_goals.values()]

    # Find the maximum and minimum values in the array
    # print(all_goals)
    max_goals = max(all_goals, key=lambda x: x['goals'])
    min_goals = min(all_goals, key=lambda x: x['goals'])


    # orientation = ""
    # if vertical_bars_radio_button.checked:
    #     orientation = 'Vertical Bars'
    # elif horizontal_bars_radio_button.checked:
    #     orientation = 'Horizontal Bars'

    # print('Selected Radio Button:', orientation)
    print("Selected graph - ", graph_type)

    if graph_type == "BAR GRAPH":
        # if orientation == "Vertical Bars":
        return [data, league, variable, totalGoals, leagues, allTeamsStats, all_goals, max_goals, min_goals, LeagueAvgAge, LeaguePasses, LeagueFouls]
        # elif orientation == "Horizontal Bars":
        #     return [data, league, variable, totalGoals, leagues, allTeamsStats, all_goals, max_goals, min_goals, LeagueAvgAge, LeaguePasses, LeagueFouls]

    elif graph_type == "HISTOGRAM":
        # if orientation == "Vertical Bars":
        return [data, league, variable, totalGoals, leagues, allTeamsStats, max_goals, max_goals, min_goals, LeagueAvgAge, LeaguePasses, LeagueFouls, la_liga_bin, premier_league_bin, ligue_1_bin, bundesliga_bin, serie_a_bin]
        # elif orientation == "Horizontal Bars":
            # return [data, league, variable, totalGoals, leagues, allTeamsStats, max_goals, max_goals, min_goals, LeagueAvgAge, LeaguePasses, LeagueFouls, la_liga_bin, premier_league_bin, ligue_1_bin, bundesliga_bin, serie_a_bin]

    elif graph_type == "SCATTERPLOT":
        return [data, league, variable, x_axis_variable, y_axis_variable, totalGoals, leagues, allTeamsStats, all_goals, max_goals, min_goals, LeagueAvgAge, LeaguePasses, LeagueFouls, la_liga_bin, premier_league_bin, ligue_1_bin, bundesliga_bin, serie_a_bin]


def read_csv():
    print("Into read csv")
    # url = '/static/Rounded_Goals_Scored_Final Dataset.csv'  # Replace with the actual URL

    try:

        csv_file_path = 'static\Rounded_Goals_Scored_Final Dataset.csv'
        data = pandas.read_csv(csv_file_path)

        headers = list(data.columns)
        rows = data.values.tolist()

        result = []
        for entries in rows:
            obj = {}
            for j in range(len(headers)):
                obj[headers[j]] = entries[j]
            result.append(obj)  

        return result

    except requests.exceptions.RequestException as error:
        print('Error reading CSV:', error)
    except pandas.errors.EmptyDataError:
        print('Error: Empty CSV file or invalid format.')

    except FileNotFoundError:
        print(f'Error: File "{csv_file_path}" not found.')

    except pandas.errors.ParserError as error:
        print(f'Error parsing CSV: {error}')