function switchEnv(region) {
    const tagGroup = '#' + region + '-group';
    if ($(tagGroup).attr("data-env") == "PROD") {
        // Change to QA
        $(tagGroup).attr("data-env", "QA");
        showList(region, 0);
    } else {
        // Change to PROD
        $(tagGroup).attr("data-env", "PROD");
        showList(region, 1);
    }
}

function showList(region, env) {
    const tagProd = '#' + region + "-PROD-list";
    const tagQA = '#' + region + "-QA-list";
    const tagLabel = '#' + region + "-env-tag";

    if (env == 1) {
        $(tagProd).addClass("flex");
        $(tagProd).removeClass("hidden");
        $(tagQA).addClass("hidden");
        $(tagQA).removeClass("flex");

        $(tagLabel).html("PROD");
    } else {
        $(tagQA).addClass("flex");
        $(tagQA).removeClass("hidden");
        $(tagProd).addClass("hidden");
        $(tagProd).removeClass("flex");

        $(tagLabel).html("QA");
    }
}