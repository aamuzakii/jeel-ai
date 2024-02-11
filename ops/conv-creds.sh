classname=$1

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
numfile="$DIR/.lastconv"
lastconv=`cat $numfile`
nextconv=`expr $lastconv + 1`
echo $nextconv > $numfile

sid=$nextconv

region=au-syd
# region=eu-gb

servicename=mlforkids-managed-$sid

watsonname=my-watson-instance
servicename=$watsonname

ibmcloud resource service-instance-create $servicename conversation standard $region >> $DIR/../logs/create-conv.log

convserviceid=`ibmcloud resource service-instance --location $region --output json $servicename  | jq --raw-output .[0].id`

ibmcloud resource service-key-create mlforkidsapikey Manager --instance-id "$convserviceid" >> $DIR/../logs/create-conv.log

convapikey=`ibmcloud resource service-keys --instance-id "$convserviceid" --output json | jq --raw-output .[0].credentials.apikey`

uuid=`uuidgen | tr '[:upper:]' '[:lower:]'`

convuser=${convapikey:0:22}
convpass=${convapikey:22:22}

my_watson_assistant_v1_base_url=https://api.au-syd.assistant.watson.cloud.ibm.com/instances/fafd6113-0b40-426c-bf2c-8d3384dc5b9c

echo "INSERT INTO bluemixcredentials (id, classid, servicetype, credstypeid, url, username, password, notes) "
echo "VALUES "
echo "('$uuid', '$classname', 'conv', 2, '$my_watson_assistant_v1_base_url', '$convuser', '$convpass', '$servicename')"
echo ";"
