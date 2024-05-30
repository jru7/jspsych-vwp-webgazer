require(rjson)

filename = '<raw data file here>'

trials <- fromJSON(file=filename)

has_screen_size <- Filter(function(x) x$trial_type == 'call-function', trials)[[1]]
center <- has_screen_size$value$actualWidth / 2
print(paste("center is: ", center))

has_gaze_data <- Filter(function(trial) !is.null(trial$webgazer_data), trials)


df <- data.frame(t=c(), x=c(), y=c(), id=c(), item_type=c(), image=c(), sound=c())

for(trial in has_gaze_data) {
  for(point in trial$webgazer_data) {
    df <- rbind(df, data.frame(t=point$t, x=point$x, y=point$y,
                               id=trial$id, item_type=trial$item_type,
                               image=trial$image, sound=trial$sound))
  }
}