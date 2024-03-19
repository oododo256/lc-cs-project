import csv
import statistics

#Initialise Variables
hoursSlept = []
mood = []

print("This program will work off the following (limited) sample data.\nIf the data were more extensive, the results would be much more accurate.\n\n")
#Open CSV File
with open('sleepdata.csv') as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    line_count = 0
    for row in csv_reader:
        if line_count == 0:
            print(f'Column names are {", ".join(row)}')
            line_count += 1
        else:
            hoursSlept.append(int(row[0]))
            mood.append(int(row[1]))
            line_count += 1
            
print("Hours Slept: " + str(hoursSlept))
print("Mood:        " + str(mood))

#Calculate Mean, Median, Mode, Standard Deviation, and Correlation Coefficient
meanHoursSlept = float(statistics.mean(hoursSlept))        #Mean
meanMood = float(statistics.mean(mood))

medianHoursSlept = float(statistics.median(hoursSlept))    #Median
medianMood = float(statistics.median(mood))

modeHoursSlept = float(statistics.mode(hoursSlept))        #Mode
modeMood = float(statistics.mode(mood))

stDevHoursSlept = float(statistics.stdev(hoursSlept))      #Standard Deviation
stDevMood = float(statistics.stdev(mood))

cC = float(statistics.correlation(hoursSlept, mood))

print("\n~~~~~Hours slept~~~~~\nMean: " + str(meanHoursSlept) + " Median: " + str(medianHoursSlept) + " Mode: " + str(modeHoursSlept))
print("\n~~~~~~~~Mood~~~~~~~~~\nMean: " + str(meanMood) + " Median: " + str(medianMood) + " Mode: " + str(modeMood))
print("\nCorrelation Coefficient: " + str(cC))

print("\nAnalysis\n")

print("\nHow much should you sleep?")
# Predict Mood From Hours Slept
# From "https://www.palomar.edu/users/rmorrissette/Lectures/Stats/Regression/Regression.htm" :
#X prime equals the correlation of X:Y multiplied by the standard deviation of X,
#then divided by the standard deviation of Y. Next multiple the sum by Y - Y bar (mean of Y).
#Finally take this whole sum and add it to X bar (mean of X).
while True:
    Y = input("Input hours slept and predict mood (Press Enter to Move On): ")
    if Y == '':
        break;
    else:
        Y = float(Y)
        xPrime = ((((cC)*(stDevMood))/(stDevHoursSlept))*(Y - meanHoursSlept)) + meanMood
        if xPrime > 10:
            xPrime = 10
        elif xPrime < 0:
            xPrime = 0
        print(str(xPrime))
        print("\n")

print("\nOne through ten, predicted from the sample data. What can this tell us?")
for i in range(11):
    Y = float(i)
    xPrime = ((((cC)*(stDevMood))/(stDevHoursSlept))*(Y - meanHoursSlept)) + meanMood
    if xPrime > 10:
        xPrime = 10
    elif xPrime < 0:
        xPrime = 0
    print(str(i) + " : " + str(xPrime))

print("It's clear that sleeping more leads to an increase in mood. This is consistent with what we would expect.\nIt is important to note that the formula used is simply an approximation based on the correlation coefficient and \ntherefore assumes that the relationship does not change as the hours of sleep increase.\nContrary to this, we would expect at a certain amount of hours of sleep (say 25), the benefits would level off or start to reverse.\n\nSuch an assumption is supported by the scientific literature. This study (https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4434546/) states in it's consensus statement that: \n\n'Sleeping more than 9 hours per night on a regular basis may be appropriate for young adults, individuals recovering from sleep debt, and individuals with illnesses. For others, it is uncertain whether sleeping more than 9 hours per night is associated with health risk.'\n\nDespite the limitations, it is clear from the data that sleeping too little results in decreased mood and so a user can use this information to improve their wellbeing.")

print("Using a computer model we can see the effects of incosistent sleep.\n")
print("Studies show exercise can improve sleep. (for example: https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10503965)\nBecause of this we'll factor in exercise into this model.")
print("\nOur model with start with 2 subjects")
print("We'll start the simulation off with Bob forgetting to exercise and sleeping a bit late.")
print("Answering the question: What if I forget to exercise and sleep enough?")

steveExercise = 1
bobExercise = 0
steveMood = 5
bobMood = 5
steveHoursSlept = 8
bobHoursSlept = 4
steveConsistency = 0
bobConsistency = 0

for i in range(10):
    print("-----------------------------------------------")
    print("Night " + str(i+1))
    print("Steve Mood: " + str(steveMood))
    print("Steve Sleep: " + str(steveHoursSlept))
    print("Steve Exercise?: " + str(steveExercise))
    
    if (steveMood >= 5 and steveHoursSlept >= 5):
        steveExercise = 1
    if (steveExercise == 1 and steveMood >= 5):
        steveHoursSlept = steveHoursSlept
        steveConsistency += 1
    elif (steveExercise == 0 and steveMood >= 5):
        steveHoursSlept = steveHoursSlept - 1
        steveConsistency = 0
    elif (steveExercise == 0 and steveMood < 5):
        steveHoursSlept = steveHoursSlept - 2
        steveConsistency = 0
    elif (steveExercise == 1 and steveMood < 5):
        steveHoursSlept = steveHoursSlept - 1
        steveConsistency = 0
    if ((not(steveConsistency == 0)) and steveExercise == 1):
        steveMood += 1
    elif (steveConsistency == 0 and steveExercise == 1):
        steveMood -= 1
    elif ((not(steveConsistency == 0)) and steveExercise == 0):
        steveMood -= 1
    elif (steveConsistency == 0 and steveExercise == 0):
        steveMood -= 2
        steveMood = steveMood
    if steveMood > 10:
        steveMood = 10
    if steveMood < 0:
        steveMood = 0
    if steveHoursSlept < 0:
        steveHoursSlept = 0
        
    print("\n\nBob Mood: " + str(bobMood))
    print("Bob Sleep: " + str(bobHoursSlept))
    print("Bob Exercise?: " + str(bobExercise))
    
    if (bobMood >= 5 and bobHoursSlept >= 5):
        bobExercise = 1
    if (bobExercise == 1 and bobMood >= 5):
        bobHoursSlept = bobHoursSlept
        bobConsistency += 1
    elif (bobExercise == 0 and bobMood >= 5):
        bobHoursSlept = bobHoursSlept - 1
        bobConsistency = 0
    elif (bobExercise == 0 and bobMood < 5):
        bobHoursSlept = bobHoursSlept - 2
        bobConsistency = 0
    elif (bobExercise == 1 and bobMood < 5):
        bobHoursSlept = bobHoursSlept - 1
        bobConsistency = 0
    if ((not(bobConsistency == 0)) and bobExercise == 1):
        bobMood += 1
    elif (bobConsistency == 0 and bobExercise == 1):
        bobMood -= 1
    elif ((not(bobConsistency == 0)) and bobExercise == 0):
        bobMood -= 1
    elif (bobConsistency == 0 and bobExercise == 0):
        bobMood -= 2
        bobMood = bobMood
    if bobMood > 10:
        bobMood = 10
    if bobMood < 0:
        bobMood = 0
    if bobHoursSlept < 0:
        bobHoursSlept = 0
  
print("Of course in reality, we would expect Bob to do something about his no sleepz\n but the purpose of this is to show how quickly your sleep patterns can deteriorate if you don't pay attention\nThis shows the alarm clock is a useful product.")
print("What if questions answered: ")
print("what if i sleep more/less is my mood affected?")
print("What if I neglet exercise and sleep?")
input("Enter any character to exit")
