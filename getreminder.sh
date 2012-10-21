#!/bin/sh
#usage BID email flag_set_reminder flag_set_rebroadcast flag_one_day_before flag_on_day flag_two_hours_before flag_arteplus7
set -e

BID=${1:?"need bid as first param"}
EMAIL=${2:?"need urlencoded email adress as second param"}
FLAG_REMINDER=${3:-true}
FLAG_REBROADCAST=${4:-true}
FLAG_ONEDAYBEFORE=${5:-false}
FLAG_ONDAY=${6:-false}
FLAG_TWOHOURS=${7:-false}
FLAG_ARTE7P=${8:-true}

BASEURL='http://www.arte.tv'
URL_PATHS="$(curl --max-time 60 --silent "http://www.arte.tv/de/program/244,broadcastingNum=${BID},day=2,week=43,year=2012,CmPart=com.arte-tv.www.html" |  grep 'var uri_re.*_revoir_' | sed 's:^.* = "\([^"]*\)";.*$:\1:')" || true


for path in $URL_PATHS; do
	case $path in
		*Erinnerung*)
			URL_REMINDER=$path
		;;
		*Wiederholung*)
			URL_REBROADCAST=$path
	esac
done

echo "reminder url: $URL_REMINDER" > /dev/stderr
echo "rebroadcast url: $URL_REBROADCAST" > /dev/stderr


have_reminder() {
	test -n "$URL_REMINDER";
}

have_rebroadcast() {
	test -n "$URL_REBROADCAST";
}


set_reminder() {
	local email="${1:-test%40domain}"
	local one_day_ahead="${2:-true}"
	local on_day="${3:-true}"
	local two_hours_before="${4:-true}"
	local arteplus7="${5:-true}"
	have_reminder && curl --max-time 30 --silent -d 'method=get' -d "email=$email" -d "time1=$one_day_ahead" -d "time2=$on_day" -d "time3=$two_hours_before" -d "artePlus7=$arteplus7" -d 'process=false' "${BASEURL}${URL_REMINDER}" > /dev/null 2>&1 
	RET=$?;
	echo "curl reminder: $RET" > /dev/stderr
	return $RET
}

set_rebroadcast() {
	local email="${1:-test%40domain}"
	have_rebroadcast && curl --max-time 30 --silent -d 'method=get' -d "email=$email" -d 'process=false' "${BASEURL}${URL_REBROADCAST}" > /dev/null 2>&1 ; 
	RET=$?;
	echo "curl rebroadcast: $RET" > /dev/stderr
	return $RET
}

#set -x
test "true" = "${FLAG_REMINDER}" &&  { set_reminder "${EMAIL}" "${FLAG_ONEDAYBEFORE}" "${FLAG_ONDAY}" "${FLAG_TWOHOURS}" "${FLAG_ARTE7P}" && echo "SUCCESS reminder" || echo "ERROR reminder"; }

test "true" = "${FLAG_REBROADCAST}" && { set_rebroadcast "${EMAIL}" && echo "SUCCESS rebroadcast" || echo "ERROR rebroadcast" ; }

#set +x
