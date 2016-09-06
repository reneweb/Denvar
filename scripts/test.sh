cd $(dirname $0)
function runTests() {
  echo "-----------------------"
  echo "Running tests in file $1"

  if [ "$2" ]
  then
    for ((test=2;test<=$#;test++))
    do
      echo "    -----------------------"
      echo "    Running test ${!test}"
      node $1 ${!test}

      if [ $? -eq 0 ]
      then
        echo "    Success: ${!test}"
      else
        echo "\033[0;31m    Failure: ${!test}\033[0m"
      fi
    done
  else
    node $1
    if [ $? -eq 0 ]
    then
      echo "Success: $1"
    else
      echo "\033[0;31mFailure: $1\033[0m"
    fi
  fi
}

runTests "../test/index.spec" "shouldProvideEnvVarsBasedOnConfig" "shouldProvideEnvVarsFromMultipleSources" "shouldOverrideProvidedEnvVarsBasedOnConfigOrder" "shouldFailIfUnknownProvider" "shouldFailIfErrorWhileReadingFromProvider"
runTests "../test/lib/async.spec"
runTests "../test/lib/provider/env.spec"
runTests "../test/lib/provider/file.spec"
runTests "../test/lib/provider/provided.spec"
